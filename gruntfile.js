module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    simplemocha: {
      all: ['test/**/*.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/brainfuck.js',
        dest: 'dest/brainfuck.min.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'simplemocha', 'uglify']);
  grunt.registerTask('test', ['jshint', 'simplemocha']);
};