'use strict';

var del = require('del');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var connect = require('gulp-connect');
var watch = require('gulp-watch');

var paths = {
  src: './app',
  des: './build'
};


gulp.task('clean', function(done) {
  del([paths.des], done);
});

gulp.task('watch-and-bundle', function () {
  var b = watchify(browserify('./app/main.js'));

  var bundle = function(){
    console.log('bundle..');
    b.transform("babelify", {presets: ["react"]})
      .bundle()
      .pipe(source('bundle.js'))
      //.pipe(buffer())
      //.pipe(uglify())
      .pipe(gulp.dest(paths.des));
  };

  b.on('update', bundle);
  return bundle();
});

//command line: browserify -t babelify main.js -o bundle.js
//browserify -t [ babelify --presets [ react ] ] app/main.js -o bundle.js
gulp.task('bundle', function () {
  browserify('./app/main.js')
    .transform("babelify", {presets: ["react"]})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.des));
});

gulp.task('connect', function() {
  connect.server({
    root: '',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./index.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./index.html', './build/bundle.js'], ['html']);
});


gulp.task('default', ['clean', 'watch-and-bundle', 'connect', 'watch']);
