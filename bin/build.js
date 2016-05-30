const fs = require('fs');
const del = require('del');
const childProcess = require('child_process');


function Builder() {
    var me = this;
    me.rootFolder = fs.realpathSync(__dirname + '/..');
    me.buildPath = me.rootFolder + '/build';
    me.blendPath = me.rootFolder + '/blend';
    me.blendSourcePath = me.blendPath + '/src';
    me.testPath = me.rootFolder + '/tests'
}

Builder.prototype.checkSanity = function(callback) {
    var me = this;
    childProcess.exec('compass -v', { cwd: me.rootFolder }, function(error, stdout, stderr) {
        if (!error) {
            callback.apply(me, [null]);
        } else {
            callback.apply(me, ['No Compass installation found!']);
        }
    });
}

Builder.prototype.cleanBuild = function(callback) {
    var me = this;
    try {
        console.log('-- Cleaning the build (' + me.buildPath + ')');
        if (fs.existsSync(me.buildPath)) {
            del.sync(me.buildPath);
        }
        fs.mkdir(me.buildPath);
        callback.apply(me, [null]);
    } catch (e) {
        callback.apply(me, [e]);
    }
}

Builder.prototype.buildStyles = function(callback) {
    var me = this;
    console.log('-- Building Themes and Styles');
    childProcess.exec('compass compile', { cwd: me.blendPath }, function(error, stdout, stderr) {
        if (!error) {
            callback.apply(me, [null]);
        } else {
            callback.apply(me, [stdout.toString()]);
        }
    });
}

Builder.prototype.buildBlend = function(callback) {
    var me = this;
    console.log('-- Building Blend');
    childProcess.exec('tsc', { cwd: me.blendPath }, function(error, stdout, stderr) {
        if (!error) {
            callback.apply(me, [null]);
        } else {
            callback.apply(me, [stdout.toString()]);
        }
    });
}

Builder.prototype.run = function() {
    var me = this;
    me.checkSanity(function(error) {
        if (!error) {
            me.cleanBuild(function(error) {
                if (!error) {
                    me.buildStyles(function(error) {
                        if (!error) {
                            me.buildBlend(function(error) {
                                if (!error) {
                                    console.log('-- Done :)')
                                } else {
                                    console.error(error);
                                }
                            });
                        } else {
                            console.error(error);
                        }
                    });
                } else {
                    console.error(error);
                }
            });
        } else {
            console.error(error);
        }
    });
}

var builder = new Builder();
builder.run();