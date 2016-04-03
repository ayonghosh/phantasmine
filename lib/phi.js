/*
 * grunt-phantasmine
 * http://gruntjs.com/
 *
 * PhantomJS script to load a Jasmine test runner, execute the tests
 * and generate a report
 *
 * Copyright (c) 2016 Ayon Ghosh, contributors
 * Licensed under the MIT license.
 */

(function () {
  var page = require('webpage').create();
  var fs   = require('fs');
  var args = require('system').args;

  // Custom defined PhantomJS process exit codes
  var EXIT_CODE = {
    TEST_PASS       : 0,
    NO_URL          : 1,
    PAGE_LOAD_ERROR : 2,
    TEST_FAIL       : 3,
    TEST_TIMEOUT    : 4,
    PAGE_ERROR      : 5
  };

  if (args.length < 2) {
    console.log('ERROR: No URL to load.');
    phantom.exit(EXIT_CODE.NO_URL);
  }

  // The URL of the page to load
  var url = 'file:///' + fs.absolute(args[1]);

  // The interval in milliseconds at which to check if unit tests have
  // finished execution
  var pollInterval = 500;

  // The maximum time in milliseconds to wait until test results,
  // abort otherwise
  var MAX_TIMEOUT_MS = 30000;
  var maxTimeout = args[5] ? parseInt(args[5], 10) : MAX_TIMEOUT_MS;
  if (isNaN(maxTimeout) || maxTimeout < 0) {
    maxTimeout = MAX_TIMEOUT_MS;
  }

  // Whether to suppress error logging of script errors on page
  var suppressPageErrors = (args[2] && args[2] === 'true');

  // Whether to show console logs on page
  var enableConsoleLogs = (args[3] && args[3] === 'true');

  // The user-specified script to inject
  var pathToScriptToInject = args[4] ? fs.absolute(args[4]) : null;

  // Handler for page script errors
  page.onError = function (msg, trace) {
    if (!suppressPageErrors) {
      console.log('ERROR: ' + msg);
      trace.forEach(function (item) {
        console.log('  ', item.file, ':', item.line);
      });
    }
    phantom.exit(EXIT_CODE.PAGE_ERROR);
  };

  // Handler for console log messages
  page.onConsoleMessage = function (msg, lineNum, srcId) {
    if (enableConsoleLogs) {
      console.log('INFO: ' + msg);
    }
  };

  // Inject shims and custom reporter hook for Jasmine into the page
  page.onResourceReceived = function() {
    page.injectJs('shims.js');
    page.injectJs('json_reporter.js');

    if (pathToScriptToInject) {
      page.injectJs(pathToScriptToInject);
    }
  };

  // Load the test runner HTML page
  page.open(url, function (status) {
    if (status === 'success') {
      // Poll until tests are complete
      var startTime = (new Date()).getTime();
      var timer = setInterval(function () {
        var isComplete = page.evaluate(function () {
          return window.ntnxTestComplete;
        });
        if (isComplete) {
          clearInterval(timer);
          var testResults = page.evaluate(function () {
            return window.jasmineResult;
          });
          console.log('Total passed: ' + testResults.pass.length);
          console.log('Total failed: ' + testResults.fail.length);

          for (var i = 0; i < testResults.fail.length; i++) {
            console.log('  ✗ ' + testResults.fail[i]);
          }

          var exitCode = testResults.fail.length ? EXIT_CODE.TEST_FAIL :
            EXIT_CODE.TEST_PASS;
          phantom.exit(exitCode);
        } else {
          // Quit after a reasonable timeout
          var timeNow = (new Date()).getTime();
          if ((timeNow - startTime) > maxTimeout) {
            clearInterval(timer);
            console.log('ERROR: Tests timed out after ' +
              maxTimeout + 'ms');
            phantom.exit(EXIT_CODE.TEST_TIMEOUT);
          }
        }
      }, pollInterval);
    } else {
      console.log('ERROR: Could not load page: ' + url);
      phantom.exit(EXIT_CODE.PAGE_LOAD_ERROR);
    }
  });
})();
