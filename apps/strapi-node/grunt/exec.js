module.exports = function (grunt) {
	grunt.loadNpmTasks('../../../node_modules/grunt-exec');

	return {
		ttsc: {
			cmd: 'ttsc -p apps/strapi-node/tsconfig.json --listEmittedFiles --extendedDiagnostics'
		}
	}
};
