var gulp = require('gulp'),
  watch = require('gulp-watch'),
  jade = require('gulp-jade'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  grunt = require('gulp-grunt'),
  livereload = require('gulp-livereload'),
  server = require('tiny-lr')();
  connect = require('connect'),
  http = require('http'),
  path = require('path'),
  open = require('open'),
  through = require('through'),
  dev = function (stream) {
    return gulp.env.dev ? stream : through();
  };

gulp.task('scripts', function() {
  gulp.src('src/scripts/**/*.js')
    .pipe(dev(watch()))
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts'))
    .pipe(dev(livereload(server)));
});

gulp.task('copy', function() {
  gulp.src('CNAME')
    .pipe(gulp.dest('public'));

  gulp.src('src/favicon.ico')
    .pipe(gulp.dest('public'));

  gulp.src('src/img/**')
    .pipe(dev(watch()))
    .pipe(gulp.dest('public/img'))
    .pipe(dev(livereload(server)));

  gulp.src('bower_components/**')
    .pipe(dev(watch()))
    .pipe(gulp.dest('public/bower_components'))
    .pipe(dev(livereload(server)));
});

gulp.task('compile', function() {
  gulp.src('src/**/*.jade')
    .pipe(dev(watch()))
    .pipe(jade())
    .pipe(gulp.dest('public'))
    .pipe(dev(livereload(server)));

  gulp.src('src/styles/**/*.styl')
    .pipe(dev(watch()))
    .pipe(stylus())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public/styles'))
    .pipe(dev(livereload(server)));
});

gulp.task('default', function() {
  gulp.run('scripts', 'compile', 'copy');
});

gulp.task('serve', function() {
  gulp.run('default');

  // Start LiveReload server
  var LIVERELOAD_PORT = 35729;
  server.listen(LIVERELOAD_PORT);

  // Start Connect server
  var CONNECT_PORT = 8000,
    app = connect()
      .use(require('connect-livereload')({ port: LIVERELOAD_PORT }))
      .use(connect.static('public'));
  http.createServer(app).listen(CONNECT_PORT);

  // Open local server in browser
  open('http://localhost:' + CONNECT_PORT);
});

gulp.task('deploy', function() {
  gulp.run('grunt-gh-pages');
});

// Add all Grunt tasks to Gulp
grunt(gulp);
