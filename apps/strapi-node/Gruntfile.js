module.exports = function(grunt) {
  const options = { config: { src: "grunt/*.js" }, requireResolution: true };
  const configs = require('load-grunt-configs')(grunt, options);
  grunt.initConfig(configs);

  grunt.file.setBase('../../');

  grunt.registerTask('build', [
    'clean',
    'copy',
    'exec:ttsc',
    'cleanempty'
  ]);
};
