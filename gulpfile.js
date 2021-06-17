const fs = require("fs");
const path = require("path");
const gulp = require('gulp');
const package = require('./package.json');
const vinyl = require("vinyl");
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
// const include      = require('gulp-include');
const include = require('./modules/gulp-include-extend');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const cssFormat = require('gulp-css-format');
const wpage = require('wpage');
// 引入入口文件目录
const entryDir = "./entry";
// dev导出目录
const devDir = "assets";
// dist导出目录
const buildDir = "assets";
// 远程发布地址
const dir = "";



const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");
const outputDir = "./dist/";
const cacheDir = "./.cache/";
const codeDir = "./src/";
const appDir = codeDir + "app/";
const appNameIgnores = ["common"];
const pageNameIgnores = ["common"];
const tasks = [];

function cleanCache(done) {
    if (fs.existsSync(cacheDir)) {
        return gulp.src(cacheDir, { read: false })
            .pipe(clean());
    } else {
        done && done();
    }
}

/** 
 * 清理输出文件夹
 */
gulp.task('clean:dist', function cleanDist(done) {
    if (fs.existsSync(outputDir)) {
        return gulp.src(outputDir, { read: false })
            .pipe(clean());
    } else {
        done();
    }
});
gulp.task('clean:cache', cleanCache);

// 自定义数量项目【按项目打包】

// pageName: {
//     name: string,
//     path: string,
//     pages: {
//         name: string,
//         path: string,
//         entry: string,
//         _entry: string,
//         resource: [
//             string:uri
//         ]
//     }
// }
function createAppSourceMap(cb) {
    let appMap = {};
    let appDirContent = fs.readdirSync(appDir);

    appDirContent.forEach(appName => {
        // 排除预设项目名
        if (appNameIgnores.includes(appName)) {
            return;
        }

        let _singleAppDir = appDir + appName + "/";

        // 只有文件夹时才认定为项目
        if (!fs.lstatSync(_singleAppDir).isDirectory()) {
            return;
        }

        let _app = {
            name: appName,
            path: _singleAppDir,
            pages: {}
        };

        // 获取单项目所有页面
        let _singleAppDirContent = fs.readdirSync(_singleAppDir);

        _singleAppDirContent.forEach(pageName => {
            // 排除预设页面名
            if (pageNameIgnores.includes(pageName)) {
                return;
            }

            let _pageDir = _singleAppDir + pageName + "/";

            if (!fs.lstatSync(_pageDir).isDirectory()) {
                return;
            }

            let page = {
                name: pageName,
                path: cacheDir + appName + "/",
                _path: _pageDir,
                _entry: _singleAppDir + "index.html",
                entry: cacheDir + appName + "/" + pageName + ".html",
                resource: [
                    _pageDir + "index.js",
                    _pageDir + "index.scss",
                ]
            };

            _app.pages[pageName] = page;

            // 创建缓存入口文件
            if (!fs.existsSync(page.path)) {
                fs.mkdirSync(page.path, {
                    recursive: true
                });
            }

            fs.writeFileSync(page.entry, fs.readFileSync(page._entry), {
                flag: "w+"
            });
        });

        appMap[appName] = _app;
    });

    cb(appMap);
}

function colAppTask (cb) {
    createAppSourceMap(function (appMap) {
        Object.values(appMap).forEach(app => {
            // 执行资源任务创建资源清单
            let globs = [];
            Object.values(app.pages).map(page => {
                globs.push(...page.resource);
            });

            // 定制支持的类型 [js,scss]
            let _task = {
                common: function (stream) {
                    return stream
                        .pipe(rename(function (pathinfo, file) {
                            let relativePath = path.relative(appDir, file.dirname);
                            pathinfo.basename = path.basename(relativePath);
                            pathinfo.dirname = "assets";
                            return pathinfo;
                        }))
                        .pipe(rev())
                        .pipe(gulp.dest(outputDir + app.name))
                        .pipe(rev.manifest(cacheDir + app.name + "/rev-manifest.json", {
                            base: cacheDir + app.name,
                            merge: true
                        }))
                        .pipe(gulp.dest(cacheDir + app.name))
                },
                scss: function () {
                    return gulp.src(globs.filter(glob => {
                        return path.extname(glob) == ".scss"
                    }))
                        .pipe(sass())
                        .pipe(autoprefixer({
                            remove: false,
                            grid: 'autoplace'
                        }))
                        .pipe(cssFormat());
                },
                js: function () {
                    return gulp.src(globs.filter(glob => {
                        return path.extname(glob) == ".js"
                    }))
                        .pipe(babel({
                            presets: ['@babel/env']
                        }))
                }
            };

            // 统一执行

            // 配置资源生成清单
            _task.common(_task.js()).on("finish", function () {
                _task.common(_task.scss()).on("finish", function () {
                    // 执行入口文件匹配使用资源清单
                    gulp.src([
                        cacheDir + app.name + "/rev-manifest.json",
                        cacheDir + app.name + "/*.html"
                    ])
                        .pipe(revCollector({
                            replaceReved: true,
                            dirReplacements: {}
                        }))
                        .pipe(gulp.dest(outputDir + app.name))
                        .on("finish", function () {
                            cb && cb();
                        })
                })
            })

        });
    });
}

gulp.task('default', gulp.series(['clean:dist', 'clean:cache'], function (done) {
    colAppTask(function () {
        cleanCache();
        done();
    });
}));




// // 打包js
// gulp.task('js', () => {
//   var stream = gulp.src(entryDir + '/prod/*.js')
//     .pipe(include({
//       includePaths: [
//         __dirname + "/src"
//       ]
//     }))
//     .pipe(babel({
//       presets: ['@babel/env']
//     }))
//     .pipe(gulp.dest('./dist/' + buildDir))

//   if (dir) {
//     stream = stream.pipe(gulp.dest(dir));
//   }

//   stream = stream.pipe(rename({extname: '.min.js'}))
//     .pipe(uglify())
//     .pipe(gulp.dest('./dist/' + buildDir))

//   if (dir) {
//     stream = stream.pipe(gulp.dest(dir));
//   }

//   return stream;
// });

// // 打包css
// gulp.task('css', () => {
//   var stream = gulp
//     .src([entryDir + '/prod/*.css'])
//     .pipe(include({
//       includePaths: [
//         __dirname + "/src"
//       ]
//     }))
//     .pipe(sass())
//     .pipe(autoprefixer({
//       remove: false,
//       grid: 'autoplace'
//     }))
//     .pipe(cssFormat())
//     .pipe(gulp.dest('./dist/' + buildDir))

//   if (dir) {
//     stream = stream.pipe(gulp.dest(dir));
//   }

//   stream = stream.pipe(rename({extname: '.min.css'}))
//     .pipe(cssmin())
//     .pipe(gulp.dest('./dist/' + buildDir))

//   if (dir) {
//     stream = stream.pipe(gulp.dest(dir));
//   }

//   return stream;
// });


// // 打包js
// gulp.task('dev:js', () => {
//   var stream = gulp.src(entryDir + '/dev/*.js')
//     .pipe(include({
//       includePaths: [
//         __dirname + "/src"
//       ]
//     }))
//     .pipe(babel({
//       presets: ['@babel/env']
//     }))
//     .pipe(gulp.dest('./site/' + devDir));

//   return stream;
// });

// // 打包css
// gulp.task('dev:css', () => {
//   var stream = gulp
//     .src([entryDir + '/dev/*.css'])
//     .pipe(include({
//       includePaths: [
//         __dirname + "/src"
//       ]
//     }))
//     .pipe(sass())
//     .pipe(autoprefixer({
//       remove: false,
//       grid: 'autoplace'
//     }))
//     .pipe(cssFormat())
//     .pipe(gulp.dest('./site/' + devDir))
//     // .pipe(gulp.dest(dir));

//   return stream;
// });

// gulp.task('clean:app', function () {
//   return gulp.src('dist/assets', { read: false })
//     .pipe(clean());
// });

// gulp.task('watchs', function () {
//   wpage.start();
//   gulp.watch(entryDir + '/**/*.css', gulp.parallel('dev:css'));
//   gulp.watch(entryDir + '/**/*.js', gulp.parallel('dev:js'));
//   gulp.watch('./extension/**/*.css', gulp.parallel('dev:css'));
//   gulp.watch('./extension/**/*.js', gulp.parallel('dev:js'));

//   gulp.watch('./src/**/*.scss', gulp.parallel('dev:css'));
//   gulp.watch('./src/**/*.js', gulp.parallel('dev:js'));
// });

// gulp.task('default', gulp.series(gulp.parallel('js', 'css')));

// gulp.task('site', gulp.series(gulp.parallel('watchs')));

// gulp.task('init', gulp.series('clean:app', gulp.parallel('js', 'css')));

// // 生成打包文件
// gulp.task('build', gulp.series('init'));
