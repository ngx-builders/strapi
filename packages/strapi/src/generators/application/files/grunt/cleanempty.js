module.exports = function (grunt) {
	grunt.loadNpmTasks('../../../node_modules/grunt-cleanempty');

	return {
    libsEmptyDirs: {
      options: {
        folders: true
      },
      src: [ 'dist/libs/**/*' ]
    }
	}
};
