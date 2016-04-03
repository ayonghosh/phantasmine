# Phantasmine
A Grunt plugin for executing Jasmine unit tests inside PhantomJS.

*Includes shims for Function.prototype.bind and Blob.*

### Install

`npm install grunt-phantasmine`


### Usage

```javascript
grunt.initConfig({
  // ...

  phantasmine: {
    files: [
      'tests/specs.html'
    ],
    options: {
      suppressErrorLog: false,
      enableConsoleLog: true,
      injectScriptPath: 'my_shims.js',
      maxTimeout: 30000
    }
  }
});
```

###### files

The list of Jasmine test runner HTML file(s). *Required*.

###### suppressErrorLog

If true, all `console.err` log messages are not suppressed. *Optional.*
Default: **false**.

###### enableConsoleLog

If true, all `console.log` messages are displayed. *Optional.*
Default: **false**.

###### injectScriptPath

If you have a script you wish to run on the PhantomJS page(s) you can specify
them here. Useful for adding additional shims or custom reporters for Jasmine.
Please note: the path of this file could either be an absolute path, or
relative to your Gruntfile.js. *Optional.*

###### maxTimeout

In case there is an unresponsive script on your page, then PhantomJS will force
quit after this time (in milliseconds) if specified. *Optional.* Defaults to
**30 seconds**.

### Error codes

The PhantomJS process will exit with one the following known exit codes:

0: All tests passed  
1: No test runner file was specified  
2: Error while loading the test runner file  
3: One or more tests failed  
4: The tests took too long to execute and timed out within the specified limit  
5: There were one or more JavaScript errors while executing the test runner
page.

If it exits with any other code it probably means there was an error
beyond the scope of this plugin, e.g., OS-level.

### Sample output

```
Running "phantasmine:files" (phantasmine) task
Executing Jasmine test runner: "../tests/specs.html"...
Total passed: 429
Total failed: 0
```

### Known issues/tips

+ The jQuery function $.html() does not work too well with SVGs in PhantomJS
hence any tests using this might break despite them working fine on other
major browsers; in such cases, use $.text() for better results.

*This file was generated on Sun Apr 03 2016 10:23:54 GMT+0530 (IST)*
