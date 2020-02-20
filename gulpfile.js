const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const include = require('gulp-include');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const wpage = require('wpage');

let filename = '*';

// 打包js
gulp.task('js', () => {
  var stream = gulp.src('./src/assets/' + filename + '.js')
    .pipe(include())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./dist/assets'))
    .pipe(gulp.dest('./site/assets'))
    .pipe(rename({extname: '.min.js'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets'));

  return stream;
});

// 打包css
gulp.task('css', () => {
  var stream = gulp
    .src(['./src/assets/' + filename + '.css'])
    .pipe(include())
    .pipe(sass({outputStyle: 'compact'}))
    .pipe(autoprefixer({
      remove: false,
      grid: 'autoplace'
    }))
    .pipe(gulp.dest('./dist/assets'))
    .pipe(gulp.dest('./site/assets'))
    .pipe(rename({extname: '.min.css'}))
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/assets'));

  return stream;
});


// 打包js
gulp.task('dev:js', () => {
  var stream = gulp.src('./src/assets/' + filename + '.js')
    .pipe(include())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./site/assets'));

  return stream;
});

// 打包css
gulp.task('dev:css', () => {
  var stream = gulp
    .src(['./src/assets/' + filename + '.css'])
    .pipe(include())
    .pipe(sass({outputStyle: 'compact'}))
    .pipe(autoprefixer({
      remove: false,
      grid: 'autoplace'
    }))
    .pipe(gulp.dest('./site/assets'));

  return stream;
});

gulp.task('clean:app', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('watchs', function () {
  wpage.start(8082);
  gulp.watch('./src/assets/**/css/*.scss', gulp.parallel('dev:css'));
  gulp.watch('./src/assets/**/js/*.js', gulp.parallel('dev:js'));
});

gulp.task('default', gulp.series(gulp.parallel('js', 'css')));

gulp.task('site', gulp.series(gulp.parallel('watchs')));

gulp.task('init', gulp.series('clean:app', gulp.parallel('js', 'css')));

// 生成打包文件
gulp.task('build', gulp.series('init'));
