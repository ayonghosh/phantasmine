/*
 * grunt-phantasmine
 * http://gruntjs.com/
 *
 * JSON reporter for Jasmine unit tests. Creates a JSON object with passed
 * and failed test case results to be used in generating a report.
 *
 * Copyright (c) 2016 Ayon Ghosh, contributors
 * Licensed under the MIT license.
 */

(function () {
  if (!window.jsonReporter && typeof jasmineRequire !== 'undefined' &&
      typeof jasmine !== 'undefined') {
    window.jasmineResult = {
      pass: [],
      fail: []
    };

    var JSONReporter = function () {
      jasmineRequire.JsApiReporter.apply(this, arguments);
    };
    JSONReporter.prototype = jasmineRequire.JsApiReporter.prototype;
    JSONReporter.prototype.constructor = JSONReporter;
    JSONReporter.prototype.suiteStarted = function (o) {

    };
    JSONReporter.prototype.specDone = function (o) {
      // Inject passed and failed results into a window-scoped object for a
      // summary to be generated later
      o = o || {};
      if(o.status !== 'passed') {
        window.jasmineResult.fail.push(o.fullName + ': ' +
          o.failedExpectations[0].message);
      }else {
        window.jasmineResult.pass.push(o.fullName);
      }
    };
    // Set a window variable when test completes. We can poll for this
    // variable within PhantomJS to detect completion of tests.
    JSONReporter.prototype.jasmineDone = function () {
      window.testComplete = true;
    };

    var env = jasmine.getEnv();
    window.jsonReporter = new JSONReporter();
    env.addReporter(window.jsonReporter);
  }
})();
