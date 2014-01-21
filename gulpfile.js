var gulp = require('gulp'),
  jade = require('gulp-jade'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  grunt = require('gulp-grunt'),
  connect = require('connect'),
  http = require('http'),
  livereload = require('livereload'),
  path = require('path'),
  chalk = require('chalk'),
  open = require('open');

gulp.task('scripts', function() {
  gulp.src('src/scripts/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('copy', function() {
  gulp.src('CNAME')
    .pipe(gulp.dest('public'));

  gulp.src('src/img/**')
    .pipe(gulp.dest('public/img'));

  gulp.src('bower_components/**')
    .pipe(gulp.dest('public/bower_components'));
});

gulp.task('compile', function() {
  gulp.src('src/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('public'));

  gulp.src('src/styles/**/*.styl')
    .pipe(stylus())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public/styles'));
});

gulp.task('default', function() {
  gulp.run('scripts', 'compile', 'copy');
});

gulp.task('dev', function() {
  gulp.run('default');

  gulp.watch('src/scripts/**', function(event) {
    gulp.run('scripts');
  });

  gulp.watch([
    'src/img/**',
    'bower_components/**'
  ], function(event) {
    gulp.run('copy');
  });

  gulp.watch([
    'src/**/*.jade',
    'src/styles/**/*.styl'
  ], function(event) {
    gulp.run('compile');
  });

  // Start LiveReload server
  var LIVERELOAD_PORT = 35729;
  livereload.createServer({ port: LIVERELOAD_PORT }).watch(path.join(__dirname, '/public'));

  // Start Connect server
  var CONNECT_PORT = 8000,
    app = connect()
      .use(require('connect-livereload')({ port: LIVERELOAD_PORT }))
      .use(connect.static('public'));
  http.createServer(app).listen(CONNECT_PORT);
  console.log('[' + chalk.green('connect') + '] Listening on port ' + chalk.magenta(CONNECT_PORT));

  // Open local server in browser
  open('http://localhost:' + CONNECT_PORT);
});

gulp.task('deploy', function() {
  gulp.run('grunt-gh-pages');
});

// Add all Grunt tasks to Gulp
grunt(gulp);
