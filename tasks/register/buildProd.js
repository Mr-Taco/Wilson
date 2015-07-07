module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
    'deployinfo',
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};
