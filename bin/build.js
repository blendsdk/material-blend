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


/*
Builder.prototype.checkSanity = function() {

    var me = this;

    var checkCompass = function(version) {
        if (childProcess.execSync('compass -v').toString().indexOf('Compass') !== -1) {
            return true;
        } else {
            throw Error('No Compass installation found!');
        }
    }

    try {
        if (checkCompass(me.minCompassVersion)) {
            return true;
        }
    } catch (e) {
        console.log('ERROR: ' + e);
        return false;
    }
}

Builder.prototype.cleanBuild = function() {
    var me = this;
    try {
        console.log('-- Cleaning the build (' + me.buildPath + ')');
        if (fs.existsSync(me.buildPath)) {
            del.sync(me.buildPath);
        }
        fs.mkdir(me.buildPath);
        return true;
    } catch (e) {
        console.log('ERROR: ' + e);
        return false;
    }
}

Builder.prototype.buildStyles = function() {
    var me = this,
        result;
    console.log('-- Building the themes');
    try {
        spawn = childProcess.spawnSync('compass', ['compile'], {
            cwd: me.blendPath,
            stdio: ['pipe', 'pipe', process.stderr]
        });
        spawn.stderr.setEncoding('utf8');
        console.log(spawn);
        return true;
    } catch (e) {
        console.log('ERROR: ' + e);
        return false;
    }
}

Builder.prototype.buildBlend = function() {
    var me = this;
    console.log('-- Building Blend');
    try {
        return true;
    } catch (e) {
        console.log('ERROR: ' + e);
    }
}

Builder.prototype.buildTests = function() {
    var me = this;
    console.log('-- Building Tests');
    try {
        return true;
    } catch (e) {
        console.log('ERROR: ' + e);
    }
}


Builder.prototype.run = function() {
    var me = this;
    console.log("MaterialBlend Framework Builder 1.0\n");
    if (me.checkSanity()) {
        if (me.cleanBuild()) {
            if (me.buildStyles()) {
                if (me.buildBlend()) {
                    if (me.buildTests()) {
                        console.log('\nDone.')
                    }
                }
            }
        }
    }
}


var builder = new Builder();
builder.run();
*/