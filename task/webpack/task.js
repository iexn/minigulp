const gulp = require("gulp");
const webpack = require("webpack");
const path = require("path");

exports.teacher = function () {
    const teacher = require("./webpack.teacher");

    gulp.task("webpack:teacher", function (callback) {
        webpack(teacher, function () {
            callback();
        });
    });
}

exports.parent = function () {
    const parent = require("./webpack.parent");

    gulp.task("webpack:parent", function (callback) {
        webpack(parent, function () {
            callback();
        });
    });
}

exports.web = function () {
    const web = require("./webpack.web");

    gulp.task("webpack:web", function (callback) {
        webpack(module.exports = {
            entry: '../../src/env/web/publish/index.ts',
            output: {
              filename: 'bundle.js',
              path: path.resolve(__dirname, 'dist')
            },
            module: {
              rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
              }]
            },
            resolve: {
              extensions: [ '.tsx', '.ts', '.js' ]
            },
          }, function () {
            callback();
        });
    });
}

exports.all = function () {
    exports.teacher();
    exports.parent();
    exports.web();

    gulp.task("webpack", gulp.series(gulp.parallel('webpack:teacher', 'webpack:parent', 'webpack:web')));
}