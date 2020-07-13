module.exports = function (grunt) {
	grunt.loadNpmTasks('../../../node_modules/grunt-contrib-copy');

	return {
		nonTS: {
			files: [
				{
					expand: true,
					cwd: 'apps/strapi-node/src',
					src: [
					  '**',
            '!**/*.ts',
            '!**/*.tsx',
            '!node_modules/**',
            '!.cache/**',
            '!.tmp/**',
            '!strapi-typescript/**'
          ],
					dest: 'dist/apps/strapi-node/src'
				},
        {
          expand: true,
          cwd: 'libs',
          src: [
            '**',
            '!client/**',
            '!**/*.*md',
            '!**/*.ts',
            '!**/*.tsx',
            '!**/*.*js',
            '!**/*.*json',
            '!**/*.*map'
          ],
          dest: 'dist/libs'
        }
			]
		}
	}
};
