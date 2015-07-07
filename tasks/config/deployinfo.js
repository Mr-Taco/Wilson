module.exports = function(grunt) {



  grunt.config.set('deployinfo', {
      hash:"deploymentHash"
  });

  grunt.registerTask('deployinfo' , function () {



    var deployinfo = grunt.config.get('deployinfo');

  
    deployinfo.hash = parseInt(Math.random()*10000000);
    





    grunt.config.set('deployinfo', deployinfo);



  });
};
