const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const package = require("./package.json");


const codeDir = "./src/";
const appDir = codeDir + "app/";
const appNameIgnores = ["common"];
const pageNameIgnores = ["common"];

/** 
 * 获取项目页面结构
 * \/src\/app\/**\/**\/index.js
 */
function createAppSourceMap(cb) {
    let terminalsMap = {};
    
    let R = new RegExp("(" + appDir + "(.+)\/(.+)\/)index\.js");
    glob.sync(appDir + "**/**/index.js")
        .forEach(function (filePath) {
            let [_path, pageDir, appName, pageName] = R.exec(filePath);

            if (appNameIgnores.includes(appName)) {
                return;
            }

            if (pageNameIgnores.includes(pageName)) {
                return;
            }

            if (!terminalsMap.hasOwnProperty(appName)) {
                terminalsMap[appName] = {
                    name: appName,
                    path: appDir + appName + "/",
                    pages: {}
                };        
            }

            let _terminal = terminalsMap[appName];

            _terminal.pages[pageName] = pageDir + "index.js";
        })

    cb(Object.values(terminalsMap));
}

function webpackConfig() {
    const configs = {};

    createAppSourceMap(function (terminals) {
        terminals.map(terminal => {
            let config = {
                mode: 'production', // development
                entry: terminal.pages,
                output: {
                    filename: 'assets/[name].[hash:8].js',
                    path: path.resolve(__dirname, 'dist', terminal.name),
                    publicPath: './assets/'
                },
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            loader: 'babel-loader',
                            include: [
                                path.resolve(__dirname, 'src')
                            ],
                        },
                        {
                            test: /\.css$/,
                            use: [
                                // { loader: 'style-loader' },
                                MiniCssExtractPlugin.loader,
                                'css-loader'
                            ]
                        },
                        {
                            test: /\.scss$/,
                            use: [
                                MiniCssExtractPlugin.loader,
                                { loader: 'css-loader', options: { modules: true } },
                                { loader: 'sass-loader' }
                            ]
                        },
                        {
                            test: /\.(gif|png|jpe?g|eot|woff|ttf|pdf)$/,
                            loader: 'file-loader',
                            options: {
                                outputPath: 'assets/resource'
                            }
                        },
                    ]
                },
                plugins: [
                    new CleanWebpackPlugin(),
                    new MiniCssExtractPlugin({
                        filename: function (pathresolve) {
                            return 'assets/[name].[chunkhash:8].css'
                        }
                    }),
                    new webpack.DefinePlugin({
                        VERSION: JSON.stringify(package.version)
                    }),
                    // new ESLintPlugin(eslintrc || {}),
                    new HtmlWebpackPlugin({
                        title: '微校云',
                        filename: '[name].html',
                        inject: false,
                        template: path.resolve(__dirname, "src/app/" + terminal.name + "/index.html"),
                        minify: false,
                        scriptLoading: 'blocking',
                        publicPath: '.'
                    })
                ],
                resolve: {
                    alias: {
                        "@": path.resolve(__dirname, 'src'),
                        "@app": path.resolve(__dirname, 'src', 'app'),
                        "@common": path.resolve(__dirname, 'src', 'common'),
                        "@resource": path.resolve(__dirname, 'src', 'resource'),
                        "~": path.resolve(__dirname, 'src/app', terminal.name)
                    }
                }
            };
            configs[terminal.name] = config;
        });
    });

    return configs;
}

module.exports = {
    createAppSourceMap,
    webpackConfig
};
