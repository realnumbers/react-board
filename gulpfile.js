var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var watchify = require('watchify');
var reactify = require('reactify');
var concat = require('gulp-concat');
var source = require("vinyl-source-stream");

gulp.task('browserify', function() {
  var bundler = browserify({
    entries: ['./app/main.js'], // Only need initial file, browserify finds the deps
    transform: [reactify], // We want to convert JSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });
  var watcher  = watchify(bundler);

  return watcher
    .on('update', function () { // When any files update
      var updateStart = Date.now();
      console.log('Updating!');
      watcher.bundle() // Create new bundle that uses the cache for high performance
        .pipe(source('main.js'))
        // This is where you add uglifying etc.
        .pipe(gulp.dest('./build/'));
      console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
  .bundle() // Create the initial bundle when starting the task
    .pipe(source('main.js'))
    .pipe(gulp.dest('./build/'));
});


// I added this so that you see how to run two watch tasks
gulp.task('css', function () {
  gulp.watch('styles/**/*.css', function () {
                         return gulp.src('styles/**/*.css')
                                                     .pipe(concat('main.css'))
                                                     .pipe(gulp.dest('build/'));
                                                     });
                                                     });

                                                     gulp.task('webserver', function() {
                                                     connect.server({
                                                     livereload: true,
                                                     root: ['.', 'build']
                                                     });
                                                     });

                                                     gulp.task('livereload', function() {
                                                     gulp.src(['./index.html', './build/*.js'])
                                                     .pipe(watch('./index.html'))
                                                     .pipe(watch('./build/main.js'))
                                                     .pipe(connect.reload());
                                                     });

// Just running the two tasks
gulp.task('default', ['browserify', 'css', 'webserver', 'livereload']);
