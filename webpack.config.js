const MWORKVERSION = "2.0.1";
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const package = require("./package.json");
const config = require("./modules/config");
const mworkConfig = require("./mwork.config");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function join() {
    return path.join.apply(path, Array.prototype.slice.call(arguments)).replace(/\\/g, '/');
}

const app = "app";
const appDir = join(config.srcDir, app, "/");

/** 
 * 输出资源文件夹名相对位置
 * 相对位置：dist\**\
 */
let outputResource = join(config.assetsDir, mworkConfig.resourceDir);
if (mworkConfig.mergeResource) {
    outputResource = join("..", mworkConfig.resourceDir);
}

/** 
 * 链接位置
 */
let resourcePublicPath = './' + config.assetsDir;
if (typeof mworkConfig.resourcePublicPath == "string") {
    resourcePublicPath = mworkConfig.resourcePublicPath;
}

/** 
 * 获取项目页面结构
 * \/src\/app\/**\/**\/index.js
 */
function createAppSourceMap(cb) {
    let terminalsMap = {};

    let R = new RegExp("(" + config.srcDir + "/" + app + "/(.+)\/(.+)\/)index\\.js");
    glob.sync(appDir + "**/**/index.js")
        .forEach(function (filePath) {
            let [_path, pageDir, appName, pageName] = R.exec(filePath);

            if (config.appNameIgnores.includes(appName)) {
                return;
            }

            if (config.pageNameIgnores.includes(pageName)) {
                return;
            }


            if (!terminalsMap.hasOwnProperty(appName)) {
                terminalsMap[appName] = {
                    name: appName,
                    path: path.resolve(appDir, appName + "/"),
                    pages: {},
                    // 获取独立项目配置
                    customConfig: {},
                    customConfigDir: join(appDir, appName, "config.js")
                };

                // 获取独立项目配置
                if (fs.existsSync(terminalsMap[appName].customConfigDir)) {
                    terminalsMap[appName].customConfig = require(terminalsMap[appName].customConfigDir) || {};
                }
            }

            let _terminal = terminalsMap[appName];

            _terminal.pages[pageName] = './' + join(pageDir, "index.js");
        })

    cb(Object.values(terminalsMap));
}

function webpackConfig() {
    const configs = {};

    createAppSourceMap(function (terminals) {
        terminals.map(terminal => {
            let _config = {
                mode: 'production', // development
                entry: terminal.pages,
                output: {
                    filename: join(config.assetsDir, '[name].[hash:8].js'),
                    path: path.resolve("dist", terminal.name),
                    publicPath: resourcePublicPath,
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
                            test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                            use: {
                                loader: 'url-loader',
                                options: {
                                    limit: 10240, // 10k
                                    name: join(outputResource, 'images', '[name].[hash:8].[ext]')
                                },
                            },
                        },
                        {
                            test: /\.(svg)(\?.*)?$/,
                            use: {
                                loader: 'file-loader',
                                options: {
                                    outputPath: join(outputResource, 'images'),
                                    name: '[name].[hash:8].[ext]',
                                    publicPath: mworkConfig.resourcePublicPath
                                },
                            },
                        },
                    ]
                },
                plugins: [
                    new CleanWebpackPlugin(),
                    new MiniCssExtractPlugin({
                        filename: function (pathresolve) {
                            return join(config.assetsDir, '[name].[chunkhash:8].css')
                        }
                    }),
                    new webpack.DefinePlugin({
                        VERSION: JSON.stringify(MWORKVERSION)
                    }),
                    // new ESLintPlugin(eslintrc || {}),
                    new HtmlWebpackPlugin({
                        title: '微校云',
                        filename: '[name].html',
                        inject: false,
                        template: path.resolve(__dirname, appDir, terminal.name, "index.html"),
                        minify: false,
                        scriptLoading: 'blocking',
                        publicPath: '.'
                    }),
                    // new BundleAnalyzerPlugin()
                ],
                resolve: {
                    alias: {
                        "@": path.resolve(__dirname, config.srcDir),
                        "@app": path.resolve(__dirname, config.srcDir, app),
                        "@common": path.resolve(__dirname, config.srcDir, 'common'),
                        "@resource": path.resolve(__dirname, config.srcDir, 'resource'),
                        "~": path.resolve(__dirname, appDir, terminal.name)
                    }
                },
                optimization: {
                    splitChunks: {
                        chunks: "initial",
                        minSize: 30720, // 模块的最小体积 30k
                        minChunks: 1, // 模块的最小被引用次数
                        maxAsyncRequests: 1, // 按需加载的最大并行请求数
                        maxInitialRequests: 1, // 一个入口最大并行请求数
                        automaticNameDelimiter: '~', // 文件名的连接符
                        name: terminal.name,
                        cacheGroups: { // 缓存组
                            // 第三方模块
                            vendors: {
                                test: /[\\/]node_modules[\\/]/,
                                name: "vendors/vendors",
                                priority: -10
                            },
                            // 公共模块
                            commons: {
                                test: /src[\\/]common[\\/]/,
                                name: "vendors/common",
                                priority: -12
                            },
                            // 单端子公共块
                            ["common-" + terminal.name]: {
                                test: new RegExp('src[\\\\\/]app[\\\\\/]' + terminal.name + '[\\\\\/]common[\\\\\/]'),
                                name: "vendors/common-" + terminal.name,
                                priority: -14
                            },
                            // 默认子页
                            default: {
                                minChunks: 1,
                                priority: -20,
                                reuseExistingChunk: true
                            }
                        }
                    }
                }
            };
            configs[terminal.name] = _config;
        });
    });

    return configs;
}

module.exports = Object.values(webpackConfig());
