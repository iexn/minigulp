const fs = require("fs");
const path = require("path");
const dir = process.cwd();
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const package = require(path.resolve(dir, "package.json"));
const eslintrc = require(path.resolve(dir, ".eslintrc.js"));

// 获取项目所有待生成页面

module.exports = function (envName, distdirName) {
    const envDir = dir + "/src/env/" + envName;
    const entrys = {};

    fs.readdirSync(envDir).map(pageName => {
        let uri = envDir + '/' + pageName;
        let stat = fs.lstatSync(uri);
        if (stat.isDirectory()) {
            let pagePath = fs.realpathSync(envDir + '/' + pageName);

            entrys[pageName] = path.resolve(pagePath, "index.ts");
        }
    });

    return {
        entry: entrys,
        output: {
            path: path.resolve(dir, distdirName),
            filename: envName + "/assets/[name].[chunkhash:8].js"
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
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
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            // alias: {
            //     "@": path.resolve(__dirname, "src")
            // }
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: function (pathresolve) {
                    return envName + '/assets/[name].[chunkhash:8].css'
                }
            }),
            new webpack.DefinePlugin({
                VERSION: JSON.stringify(package.version)
            }),
            // new ESLintPlugin(eslintrc || {}),
            new HtmlWebpackPlugin({
                title: '微校云',
                filename: envName + '/[name].html',
                inject: false,
                template: path.resolve(dir, "src/env/" + envName + "/index.html")
            })
        ],
        optimization: {
            splitChunks: {
                chunks: 'async',
                minSize: 20000,
                minRemainingSize: 0,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
        },
    };

};