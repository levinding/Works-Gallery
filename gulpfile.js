/**
 *  Amaze UI Starter Kit
 *
 *  Forked from Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// JavaScript 格式校验
gulp.task('jshint', function() {
  return gulp.src('app/js/plugin.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// 图片优化
gulp.task('images', function() {
  return gulp.src('app/i/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/i'))
    .pipe($.size({title: 'i'}));
});

// 拷贝相关资源
gulp.task('copy', function() {
  return gulp.src([
    'app/js/vendor/*.js'
  ], {
    dot: true
  })
    .pipe(gulp.dest(function(file) {
      return 'dist/js/vendor';
    }))
    .pipe($.size({title: 'copy'}));
});

// 编译 Less，添加浏览器前缀
gulp.task('styles', function() {
  return gulp.src(['app/less/*.less'])
    .pipe($.changed('styles', {extension: '.less'}))
    .pipe($.less())
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(gulp.dest('dist/css'))
    .pipe($.csso())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'))
    .pipe($.size({title: 'styles'}));
});

// 打包 Common JS 模块
var bundleInit = function() {
  var b = watchify(browserify({
    entries: 'app/js/plugin.js',
    basedir: __dirname,
    cache: {},
    packageCache: {}
  }));

  // 如果你想把 jQuery 打包进去，注销掉下面一行
  b.transform('browserify-shim', {global: true});

  b.on('update', function() {
    bundle(b);
  }).on('log', $.util.log);

  bundle(b);
};

var bundle = function(b) {
  return b.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('plugin.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist/js/plugins'))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js/plugins'));
};

gulp.task('browserify', bundleInit);

//压缩、合并第三方插件
gulp.task('concat', function(){
	return gulp.src('app/js/plugins/*.js')
	.pipe($.concat('plugin.js'))
	.pipe(gulp.dest('dist/js/plugins'))
	.pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js/plugins'));
});

// 压缩 自定义JS
gulp.task('compressJS', function(){
	return gulp.src('app/js/custom/*.js')
	.pipe(buffer())
    .pipe(gulp.dest('dist/js'))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'));
});

// 压缩 HTML
gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    // Minify Any HTML
 //   .pipe($.minifyHtml())
    // Output Files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// 洗刷刷
gulp.task('clean', function(cb) {
  del(['dist/js/*.js', 'dist/js/plugins/*.js', 'dist/css/*.css','dist/i/*', 'dist/*.html'], {dot: true}, cb);
});

// 监视源文件变化自动cd编译
gulp.task('watch', function() {
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/less/**/*less', ['styles']);
  gulp.watch('app/i/**/*', ['images']);
  // 使用 watchify，不再需要使用 gulp 监视 JS 变化
  // gulp.watch('app/js/**/*', ['browserify']);
});

// 启动预览服务，并监视 Dist 目录变化自动刷新浏览器
gulp.task('serve', ['default'], function() {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'ASK',
    server: 'dist'
  });

  gulp.watch(['dist/**/*'], reload);
});

// 默认任务
gulp.task('default', function(cb) {
  runSequence('clean', ['styles', 'html', 'images', 'compressJS', 'browserify'], 'watch', cb);
});
