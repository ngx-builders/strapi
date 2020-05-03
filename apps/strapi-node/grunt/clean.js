module.exports = function (grunt) {
	grunt.loadNpmTasks('../../../node_modules/grunt-contrib-clean');

	return {
		dist: {
			src: ['dist/apps/strapi-node']
		}
	}
};
