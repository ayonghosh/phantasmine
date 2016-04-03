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

### Sample output

```
Running "phantasmine:files" (phantasmine) task
Executing Jasmine test runner: "../tests/specs.html"...
Total passed: 429
Total failed: 0
```

*This file was generated on Sun Apr 03 2016 10:23:54 GMT+0530 (IST)*
