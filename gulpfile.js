var gulp = require("gulp");
var fs = require("fs");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var reactify = require("reactify"); // react组件
var through = require("through2");
var { minify } = require("uglify-js");
const babel = require("@babel/core");

// 如果需要什么插件则看 gulp-xxx 插件 查看源码改造即可

// es6 转es5
var gpBabel = function (options = {}) {
  return function (path, opts) {
    return through(function (chunk, enc, callback) {
      babel
        .transformAsync(chunk, options)
        .then((res) => {
          //   this.push(res.code);

          this.push(write(res.code));
        })
        .catch((err) => {})
        .then(
          () => callback(),
          () => callback()
        );
    });
  };
};

function write(chunk) {
  if (!Buffer.isBuffer(chunk)) {
    chunk = Buffer.from(chunk);
  }
  return chunk;
}
// 压缩
var uglify = function (options = {}) {
  return function (path, opts) {
    return through(function (chunk, enc, callback) {
      const { error, code, map } = minify(chunk.toString(), {
        sourceMap: true,
        ...options,
      });

      if (error) {
        console.log("path=", path);
        console.log("error==", error);
      }

      this.push(write(error ? chunk : code));

      callback();
    });
  };
};

//任务
gulp.task("src", function () {
  //通过browserify管理依赖
  return (
    browserify({
      //入口点,app.jsx
      entries: ["./src/index.js"],
      //利用reactify工具将jsx转换为js
      transform: [
        uglify({
          annotations: true, //如果一个函数调用前面有注释注释/*@__PURE__*/或/*#__PURE__*/，则该函数调用被标记为“纯”。例如:/*@__PURE__*/foo();
          toplevel: true, //-在顶级作用域中删除未引用的函数("funcs")和/或变量("vars")
        }),
        gpBabel({
          presets: ["@babel/env"],
        }),
      ],
      // umd 模式
      standalone: "index",
    })
      //转换为gulp能识别的流
      .bundle()
      //合并输出为index.js
      .pipe(source("index.js"))
      //输出到当前文件夹中
      .pipe(gulp.dest("./dist"))
  );
});

// 启动任务
gulp.task(
  "default",
  gulp.series(["src"], (done) => done())
);
