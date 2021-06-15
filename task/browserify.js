const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const source = require("vinyl-source-stream");
const browserify = require("browserify");
const buffer = require("vinyl-buffer");

gulp.task("b", () => {
    return browserify({
        basedir: './src',
        debug: false,
        entries: ['index.js'],
        cache: {},
        packageCache: {}
    })
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});
