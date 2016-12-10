var compressor = require('node-minify');
var async = require('async');
var args = process.argv.slice(2);
var fs = require('fs');

var latestBuild = function(exitCb, errorSensitive, testType) {
    if(typeof errorSensitive == 'undefined') {
        errorSensitive = false;
    }
    if(typeof testType == 'undefined') {
        testType = 0;
    }

    var finish = [null, null, null];
    console.log('Starting assets build for CSS, JS libraries and JS app...');

    if(errorSensitive) {
        console.log('NOTICE: Build is error sensitive!');
    }

    async.parallel([function(cb) {
        var start = process.hrtime();

        if(testType != 0 && testType != 2) {
            console.log('> Skipping JavaScript build');
            return cb();
        }

        compressor.minify({
            compressor: 'yui-js',
            input: 'public/js/*.js',
            output: 'public/build.js',
            tempPath: '/tmp/',
            callback: function(err, min) {
                if(err) {
                    console.error(err);

                    if(errorSensitive) {
                        console.error('> Unable to build JavaScripts.');
                        return exitCb(1);
                    }
                }

                finish[0] = (process.hrtime(start)[1] / 1000000).toFixed(3);

                if(errorSensitive) {
                    console.log('> Built JavaScripts in ' + finish[0] + 'ms');
                }

                return cb();
            }
        });
    }, function(cb) {
        var start = process.hrtime();

        if(testType != 0 && testType != 2) {
            console.log('> Skipping library JavaScript build');
            return cb();
        }

        compressor.minify({
            compressor: 'yui-js',
            input: 'public/js/lib/*.js',
            output: 'public/lib-build.js',
            tempPath: '/tmp/',
            callback: function(err, min) {
                if(err) {
                    console.error(err);

                    if(errorSensitive) {
                        console.error('> Unable to build library JavaScripts.');
                        return exitCb(2);
                    }
                }
                
                finish[3] = (process.hrtime(start)[1] / 1000000).toFixed(3);

                if(errorSensitive) {
                    console.log('> Built library JavaScripts in ' + finish[3] + 'ms');
                }

                return cb();
            }
        });
    }, function(cb) {
        var start = process.hrtime();
        
        if(testType != 0 && testType != 1) {
            console.log('> Skipping CSS build');
            return cb();
        }

        compressor.minify({
            compressor: 'yui-css',
            input: 'public/css/*.css',
            output: 'public/build.css',
            tempPath: '/tmp/',
            callback: function(err, min) {
                if(err) {
                    console.error(err);

                    if(errorSensitive) {
                        console.error('> Unable to build CSS.');
                        return exitCb(3);
                    }
                }
                
                finish[1] = (process.hrtime(start)[1] / 1000000).toFixed(3);

                if(errorSensitive) {
                    console.log('> Built CSS in ' + finish[1] + 'ms');
                }

                return cb();
            }
        });
    }], function() {
        if(!errorSensitive) {
            console.log('Assets build completed, JS took ' + finish[0] + 'ms, JS libraries took ' + finish[3] + 'ms and CSS took ' + finish[1] + 'ms');    
        }
        
        return exitCb(0);
    });
}

module.exports.latestBuild = latestBuild;


if(args.length == 1 && args[0] == '--both') {
    latestBuild(function() {
        process.exit(0);
    });
}

if(args.length == 1 && args[0] == '--both-test') {
    latestBuild(function(exitCode) {
        console.info('> Assets build status: ' + (exitCode == 0 ? 'OK' : 'FAIL (' + exitCode + ')'));
        process.exit(exitCode);
    }, true);
}

if(args.length == 1 && args[0] == '--css-test') {
    latestBuild(function(exitCode) {
        console.info('> Assets build status: ' + (exitCode == 0 ? 'OK' : 'FAIL (' + exitCode + ')'));
        process.exit(exitCode);
    }, true, 1);
}

if(args.length == 1 && args[0] == '--js-test') {
    latestBuild(function(exitCode) {
        console.info('> Assets build status: ' + (exitCode == 0 ? 'OK' : 'FAIL (' + exitCode + ')'));
        process.exit(exitCode);
    }, true, 2);
}
