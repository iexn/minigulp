const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { join } = require("../../util");
const config = require("../../config");

const app = "app";
const appDir = join(config.srcDir, app, "/");

module.exports = function (mode, terminal) {
    return  [
        // new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: function (pathresolve) {
                return join(terminal.name, config.assetsDir, '[name].[chunkhash:8].css')
            }
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(config.MWORKVERSION)
        }),
        // new ESLintPlugin(eslintrc || {}),
        new HtmlWebpackPlugin({
            title: '微校云',
            filename: terminal.name + '/[name].html',
            inject: false,
            template: path.resolve(config.processDir, appDir, terminal.name, "index.html"),
            minify: false,
            scriptLoading: 'blocking',
            publicPath: '.'
        }),
        // new BundleAnalyzerPlugin(),
        // new webpack.NamedModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin()
    ];
};
