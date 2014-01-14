module.exports = function(grunt) {

  grunt.initConfig({
    'gh-pages': {
      public: {
        options: {
          base: 'public'
        },
        src: '**/*'
      }
    }
  });

  grunt.loadNpmTasks('grunt-gh-pages');

};