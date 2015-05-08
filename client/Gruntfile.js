module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		delta: {
			less: {
				files: ['src/**/*.less', 'less/base.less'],
				tasks: ['less:app']
			}
		},
		less: {
			app: {
				options: {
					compress: false,
					sourceMap: true,
					sourceMapFilename: 'css/main.css.map',
					sourceMapBasepath: 'css',
				},
				files: {
					'css/main.css': 'less/main.less'
				}
			}
		}
	});

	grunt.renameTask('watch', 'delta');

	grunt.registerTask('watch', ['less:app', 'delta']);
};