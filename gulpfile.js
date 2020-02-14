const gulp         = require('gulp');
const uglify       = require('gulp-uglify');
const babel        = require('gulp-babel');
const rename       = require('gulp-rename');
const clean        = require('gulp-clean');
const include      = require('gulp-include');
const autoprefixer = require('gulp-autoprefixer');
const sass         = require('gulp-sass');
const cssmin       = require('gulp-cssmin');
const cssFormat    = require('gulp-css-format');
const connect      = require('gulp-connect');
const beautify     = require('gulp-beautify');

/**
 * Tips:
 * 1. babel转完后，注释内容会向上对齐，单行注释会与上一行合并
 * 2. 多html项目暂时不能打包单独的一套文件
 * 3. html处理完，不能添加rev的hash文件
 */

const config = {
  baseUrl: './src/',
  siteUrl: './site/',
  distUrl: './dist/',
  port: 8081
};


/*

  [ dev ]

*/
gulp.task('dev:js', () => {
  var stream = gulp.src(config.baseUrl + 'assets/*.js')
    .pipe(include())
    .pipe(beautify.js({ indent_size: 4 }))
    .pipe(babel())
    .pipe(gulp.dest(config.siteUrl + 'assets'));

  return stream;
});

gulp.task('dev:css', () => {
  var stream = gulp.src(config.baseUrl + 'assets/*.css')
    .pipe(include())
    .pipe(sass())
    .pipe(autoprefixer({
      remove: false,
      grid: 'autoplace'
    }))
    .pipe(cssFormat({ indent: 1, hasSpace: true }))
    .pipe(gulp.dest(config.siteUrl + 'assets'));

  return stream;
});

gulp.task('dev:html', () => {
  var stream = gulp.src(config.baseUrl + '*.html')
    .pipe(gulp.dest(config.siteUrl));

  return stream;
});

/*

  [prod]

*/
gulp.task('prod:js', () => {
  var stream = gulp.src(config.baseUrl + 'assets/*.js')
    .pipe(include())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(config.distUrl + 'assets'))
    .pipe(uglify())
    .pipe(rename(path => {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(config.distUrl + 'assets'));

  return stream;
});

gulp.task('prod:css', () => {
  var stream = gulp.src(config.baseUrl + 'assets/*.css')
    .pipe(include())
    .pipe(sass())
    .pipe(autoprefixer({
      remove: false,
      grid: 'autoplace'
    }))
    .pipe(cssFormat({ indent: 1, hasSpace: true }))
    .pipe(gulp.dest(config.distUrl + 'assets'))
    .pipe(cssmin())
    .pipe(rename(path => {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(config.distUrl + 'assets'));

  return stream;
});

gulp.task('prod:html', () => {
  var stream = gulp.src(config.baseUrl + '*.html')
    .pipe(gulp.dest(config.distUrl));

  return stream;
});


/*

  [process]

*/

gulp.task('reload', () => {
  gulp.src('./site/*.html')
    .pipe(connect.reload());
});

gulp.task('clean:app', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('watch', function () {
  gulp.watch(config.baseUrl + 'assets/css/*.scss', gulp.parallel('dev:css'));
  gulp.watch(config.baseUrl + 'assets/js/*.js', gulp.parallel('dev:js'));
  gulp.watch(config.baseUrl + '*.html').on('change', gulp.series(gulp.parallel('dev:html', 'reload')));
});

gulp.task('connect', () => {
  connect.server({
    root: 'site',
    port: config.port,
    livereload: true,
    host: '::'
  })
});


/*

  [Set]

*/

gulp.task('default', gulp.series(gulp.parallel('prod:js', 'prod:css', 'prod:html')));

gulp.task('site', gulp.series(gulp.parallel('connect', 'watch')));

gulp.task('init', gulp.series('clean:app', gulp.parallel('default')));

// 生成打包文件
gulp.task('build', gulp.series('init'));
