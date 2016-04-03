/*
 * grunt-phantasmine
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 Ayon Ghosh, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  var phantomjs = require('phantomjs');

  grunt.registerMultiTask('phantasmine', 'Run Jasmine unit tests in PhantomJS', function () {
      // This is an async task since PhantomJS will be spawned in a child
      // process
      var done = this.async();

      var options = this.options({
        suppressErrorLog: false,
        enableConsoleLog: false,
        injectScriptPath: '',
        maxTimeout      : -1
      });

      if (options.injectScriptPath) {
        options.injectScriptPath = process.cwd() + options.injectScriptPath;
      }

      // Iterate over all specified files
      this.filesSrc.forEach(function (file) {
        grunt.log.writeln('Executing Jasmine test runner: "' + file + '"...');

        // Spawn a child process to run the tests in a headless browser
        var child = grunt.util.spawn({
          cmd: phantomjs.path,
          args: [
            __dirname + '/../lib/phi.js',
            file,
            options.suppressErrorLog,
            options.enableConsoleLog,
            options.injectScriptPath,
            options.maxTimeout
          ]
        }, function (error, result, code) {
          // Dump stdout
          console.log(result.stdout);
          if (code) {
            grunt.fail.warn('Error executing Jasmine unit tests (error ' +
              code + ')', code);
          }
          // Signal end of async task
          done();
        });
      });
    }
  );
};
