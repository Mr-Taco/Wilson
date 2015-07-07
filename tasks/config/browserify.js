/**
 * Created by Pavel on 11/16/2014.
 */
module.exports = function(grunt) {

  grunt.config.set('browserify', {
    dev:{
      files: {
        ".tmp/public/burn/js/application.js" : ["assets/burn/js/app/index.coffee"]
      },
      options: {
          browserifyOptions: {
              debug : true
          },

          transform: ['coffeeify' , 'jadeify']

      }



    }
  });

  grunt.loadNpmTasks('grunt-browserify');
};
