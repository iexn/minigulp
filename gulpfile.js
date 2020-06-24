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
const wpage        = require('wpage');
// dev导出目录
const devDir       = "assets";
// dist导出目录
const buildDir     = "assets";
// 远程发布地址
const dir          = "";

// 打包js
gulp.task('js', () => {
  var stream = gulp.src('./main/build/*.js')
    .pipe(include())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./dist/' + buildDir))
    .pipe(gulp.dest(dir))
    .pipe(rename({extname: '.min.js'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/' + buildDir))
    .pipe(gulp.dest(dir));

  return stream;
});

// 打包css
gulp.task('css', () => {
  var stream = gulp
    .src(['./main/build/*.css'])
    .pipe(include())
    .pipe(sass())
    .pipe(autoprefixer({
      remove: false,
      grid: 'autoplace'
    }))
    .pipe(cssFormat())
    .pipe(gulp.dest('./dist/' + buildDir))
    .pipe(gulp.dest(dir))
    .pipe(rename({extname: '.min.css'}))
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/' + buildDir))
    .pipe(gulp.dest(dir));

  return stream;
});


// 打包js
gulp.task('dev:js', () => {
  var stream = gulp.src('./main/dev/*.js')
    .pipe(include())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./site/' + devDir));

  return stream;
});

// 打包css
gulp.task('dev:css', () => {
  var stream = gulp
    .src(['./main/dev/*.css'])
    .pipe(include())
    .pipe(sass())
    .pipe(autoprefixer({
      remove: false,
      grid: 'autoplace'
    }))
    .pipe(cssFormat())
    .pipe(gulp.dest('./site/' + devDir))
    // .pipe(gulp.dest(dir));

  return stream;
});

gulp.task('clean:app', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('watchs', function () {
  wpage.start(8081);
  gulp.watch('./main/**/*.css', gulp.parallel('dev:css'));
  gulp.watch('./main/**/*.js', gulp.parallel('dev:js'));

  gulp.watch('./src/**/*.scss', gulp.parallel('dev:css'));
  gulp.watch('./src/**/*.js', gulp.parallel('dev:js'));
});

gulp.task('default', gulp.series(gulp.parallel('js', 'css')));

gulp.task('site', gulp.series(gulp.parallel('watchs')));

gulp.task('init', gulp.series(/* 'clean:app', */ gulp.parallel('js', 'css')));

// 生成打包文件
gulp.task('build', gulp.series('init'));
