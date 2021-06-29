const path = require("path");
const { join } = require("../../util");
const config = require("../../config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/** 
 * 输出资源文件夹名相对位置
 * 相对位置：dist\**\
 */
let outputResource = join(config.assetsDir, config.mworkConfig.resourceDir);
if (config.mworkConfig.mergeResource) {
    outputResource = join("..", config.mworkConfig.resourceDir);
}

module.exports = function (mode) {
    return {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(config.processDir, 'src')
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
                        publicPath: config.mworkConfig.resourcePublicPath
                    },
                },
            },
        ]
    };
}
