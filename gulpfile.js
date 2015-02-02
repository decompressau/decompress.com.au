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
  Twitter = require('ntwitter'),
  _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  isDev = process.argv.indexOf('dev') >= 0,
  livereloadIfDevMode = function (stream) {
    return isDev ? livereload(server) : through();
  },
  watchableSrc = function(glob) {
    return isDev ? watch(glob) : gulp.src(glob);
  };

gulp.task('scripts', function() {
  watchableSrc('src/scripts/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts'))
    .pipe(livereloadIfDevMode());
});

gulp.task('copy', function() {
  gulp.src('CNAME')
    .pipe(gulp.dest('public'));

  gulp.src('src/favicon.ico')
    .pipe(gulp.dest('public'));

  watchableSrc('src/images/**')
    .pipe(gulp.dest('public/images'))
    .pipe(livereloadIfDevMode());

  watchableSrc('bower_components/**')
    .pipe(gulp.dest('public/bower_components'))
    .pipe(livereloadIfDevMode());
});

gulp.task('compile', function() {
  watchableSrc('src/**/*.jade')
    .pipe(jade({
        data: {
          speakers: require('./data/speakers.json'),
          avatars: require('./data/avatars.json')
        }
      }))
    .pipe(gulp.dest('public'))
    .pipe(livereloadIfDevMode());

  watchableSrc('src/styles/**/*.styl')
    .pipe(stylus())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public/styles'))
    .pipe(livereloadIfDevMode());
});

gulp.task('default', ['scripts', 'compile', 'copy']);

gulp.task('serve', ['default'], function() {
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

gulp.task('dev', ['serve']);

gulp.task('avatars', function(done) {
  var handles = _.pluck(require('./data/speakers.json'), 'twitter'),
    twitter = new Twitter(require('./data/twitter.json'));

  twitter.showUser(handles, function(err, users) {
    var data = {};

    users.forEach(function(user) {
      data[user.screen_name] = user.profile_image_url.replace('_normal.', '_reasonably_small.');
    });

    fs.writeFile(path.join(__dirname, 'data/avatars.json'), JSON.stringify(data, null, 2), done);
  });
});

gulp.task('deploy', ['grunt-gh-pages']);

// Add all Grunt tasks to Gulp
grunt(gulp);
