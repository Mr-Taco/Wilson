/**
 * Compiles STYL files into CSS.
 *
 * ---------------------------------------------------------------
 *
 * Only the `assets/styles/importer.styl` is compiled.
 * This allows you to control the ordering yourself, i.e. import your
 * dependencies, mixins, variables, resets, etc. before other stylesheets)
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-less
 */
module.exports = function(grunt) {

    grunt.config.set('stylus', {
        dev: {
            options:{
                paths: ['assets/burn/styles'],
                urlfunc:'embedurl',
                compress:false,
                use: [
                    /*
                    * add plugins
                    * nib is already installed
                    * */
                ],
                import: [
                    'nib'
                ]
            },
            files:{
                '.tmp/public/burn/styles/importer.css': 'assets/burn/styles/importer.styl'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-stylus');
};
