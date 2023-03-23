var gulp = require("gulp");
// var browserify = require("browserify");
var browserify = require("gulp-browserify");
var less = require("gulp-less");
const babel = require("gulp-babel");
var reactify = require("reactify");
var rename = require("gulp-rename");

less = require("gulp-less");

// gulp.task("testLess", function () {
//   gulp
//     .src(["src/less/index.less", "src/less/detail.less"]) //多个文件以数组形式传入
//     .pipe(less())
//     .pipe(gulp.dest("src/css")); //将会在src/css下生成index.css以及detail.css
// });

//gulp主动设置的命令
gulp.task("combine", function () {
  //通过browserify管理依赖
  return gulp
    .src("src/index.js", { read: false })
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(
      browserify({
        // transform: ["coffeeify"],
        // extensions: [".coffee"],
        //利用reactify工具将jsx转换为js
        // transform : [reactify]
        // extensions: [".js"],
      })
    )
    .pipe(rename("app.js"))
    .pipe(gulp.dest("./build/js"));
  // return (
  //   browserify({
  //     //入口点,app.jsx
  //     entries: ["./lib/index.js"],
  //     //利用reactify工具将jsx转换为js
  //     // transform : [reactify]
  //   })
  //     .pipe(
  //       babel({
  //         presets: ["@babel/env"],
  //       })
  //     )
  //     //转换为gulp能识别的流
  //     .bundle()
  //     //合并输出为app.js
  //     .pipe(source("sharedb.js"))
  //     //输出到当前文件夹中
  //     .pipe(gulp.dest("./dist"))
  // );
});

//gulp默认命令
// gulp.task("default",["combine"]);

// gulp.task('default', ['htmlmin', 'cssmin', 'jsmin', 'copy']);

gulp.task(
  "default",
  gulp.series("combine", (done) => done())
);
