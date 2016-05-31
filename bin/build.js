
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const del = require('del');
const path = require('path');
const childProcess = require('child_process');
const uglify = require("uglify-js");
const vercompare = require('version-comparison');

/**
 * Builder class constructor
 */
function Builder() {
    var me = this;
    me.minCompassVersion = '1.0.3';
    me.minTypeScriptVersion = '1.8.10';
    me.rootFolder = fs.realpathSync(__dirname + '/..');
    me.buildPath = me.rootFolder + '/build';
    me.blendPath = me.rootFolder + '/blend';
    me.blendSourcePath = me.blendPath + '/src';
    me.testPath = me.rootFolder + '/tests'
    me.copyrightHeader = [
        '/**',
        ' * Copyright 2016 TrueSoftware B.V. All Rights Reserved.',
        ' *',
        ' * Licensed under the Apache License, Version 2.0 (the "License");',
        ' * you may not use this file except in compliance with the License.',
        ' * You may obtain a copy of the License at',
        ' *',
        ' *      http://www.apache.org/licenses/LICENSE-2.0',
        ' *',
        ' * Unless required by applicable law or agreed to in writing, software',
        ' * distributed under the License is distributed on an "AS IS" BASIS,',
        ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
        ' * See the License for the specific language governing permissions and',
        ' * limitations under the License.',
        ' */'
    ]
}

/**
 * Checks if compass exists and it is the correct version.
 */
Builder.prototype.checkCompassSanity = function (callback) {
    var me = this;
    console.log('-- Checking the build environment');
    childProcess.exec('compass -v', { cwd: me.rootFolder }, function (error, stdout, stderr) {
        if (!error) {
            parts = stdout.split("\n");
            if (parts.length < 1) {
                callback.apply(me, ['Could not recognize Compass!']);
            }
            parts = parts[0].split(' ');
            if (parts.length !== 3) {
                callback.apply(me, ['Could not read Compass version!']);
            }
            if (vercompare(parts[1], me.minCompassVersion) !== -1) {
                callback.apply(me, [null]);
            } else {
                console.log('Invalid Compass version! Found ' + parts[1] + ', but we require as least ' + me.minCompassVersion)
            }
        } else {
            callback.apply(me, ['No Compass installation found!']);
        }
    });
}

/**
 * Checks if TypeScript exists and it is the correct version.
 */
Builder.prototype.checkTypeScriptSanity = function (callback) {
    var me = this;
    console.log('-- Checking the build environment');
    childProcess.exec('tsc -v', { cwd: me.rootFolder }, function (error, stdout, stderr) {
        if (!error) {
            parts = stdout.trim().split(" ");
            if (parts.length != 2) {
                callback.apply(me, ['Could not recognize TypeScript!']);
            }
            if (vercompare(parts[1], me.minTypeScriptVersion) !== -1) {
                callback.apply(me, [null]);
            } else {
                console.log('Invalid TypeScript version! Found ' + parts[1] + ', but we require as least ' + me.minTypeScriptVersion)
            }
        } else {
            callback.apply(me, ['No TypeScript installation found!']);
        }
    });
}

/**
 * Cleanup the build folder. (Delete and Recreate and empty build folder!)
 */
Builder.prototype.cleanBuild = function (callback) {
    var me = this;
    try {
        console.log('-- Cleaning the build (' + me.buildPath + ')');
        if (fs.existsSync(me.buildPath)) {
            del.sync(me.buildPath, {
                force: true
            });
        }
        fs.mkdir(me.buildPath);
        callback.apply(me, [null]);
    } catch (e) {
        callback.apply(me, [e]);
    }
}

/**
 * Build the themes and styles used external Compass
 */
Builder.prototype.buildStyles = function (callback) {
    var me = this;
    console.log('-- Building Themes and Styles');
    childProcess.exec('compass compile', { cwd: me.blendPath }, function (error, stdout, stderr) {
        if (!error) {
            callback.apply(me, [null]);
        } else {
            callback.apply(me, [stdout.toString()]);
        }
    });
}

/**
 * Build the TS sources, both framework and tests
 */
Builder.prototype.buildBlend = function (callback) {
    var me = this;
    console.log('-- Building Blend');
    childProcess.exec('tsc', { cwd: me.blendPath }, function (error, stdout, stderr) {
        if (!error) {
            callback.apply(me, [null]);
        } else {
            callback.apply(me, [stdout.toString()]);
        }
    });
}

/**
 * Run a series of functions sequentially and when done call the whenDone callback
 */
Builder.prototype.runSerial = function (callbacks, whenDone) {
    var me = this;
    var makeCall = function (fn, cb) {
        return function (error) {
            if (!error) {
                if (cb) {
                    fn.apply(me, [cb]);
                } else {
                    fn.apply(me);
                }
            } else {
                console.log(error);
            }
        }
    }
    var index = callbacks.length;
    var lastCall = whenDone;
    while ((index--) !== 0) {
        lastCall = makeCall(callbacks[index], lastCall);
    }
    lastCall.apply(me, []);
}

/**
 * Builds the framework and prepares files for distribution
 */
Builder.prototype.buildFramework = function () {
    var me = this;

    var done = function () {
        console.log('-- Done');
    }

    me.runSerial([
        me.checkTypeScriptSanity,
        me.checkCompassSanity
        , me.cleanBuild
        , me.buildStyles
        , me.buildBlend
    ], done);

}

/**
 * Places copyright headers in source files
 */
Builder.prototype.copyrightFiles = function (folder, extensions) {
    console.log('-- Looking for files');
    var me = this,
        count = 0,
        header = me.copyrightHeader.join("\n");
    extensions = extensions || ['.ts', 'scss'];
    files = me.readFiles(folder, function (fname) {
        var ext = path.extname(fname);
        return extensions.indexOf(ext) !== -1
            && fname.indexOf(path.sep + 'typings' + path.sep) === -1;
    });
    files.forEach(function (fname) {
        var contents = fs.readFileSync(fname).toString();
        if (contents.indexOf('Copyright 2016 TrueSoftware B.V') === -1) {
            contents = header + "\n\n" + contents;
            fs.writeFileSync(fname, contents);
            console.log('-- Updated ' + fname);
        }
    });
    console.log('-- ' + count + ' files updated!');
    console.log('-- Done\n');
}

/**
 * Recursively reads files from a given folder and applies a filter to
 * be able to exclude some files
 */
Builder.prototype.readFiles = function (dir, filter) {
    var me = this,
        results = [];
    filter = filter || function (fname) {
        return true;
    }
    var list = fs.readdirSync(dir)
    list.forEach(function (file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
            results = results.concat(me.readFiles(file, filter))
        } else {
            if (filter(file) === true) {
                results.push(file)
            }
        }
    })
    return results;
}

/**
 * Make sure paths are consistent with the OS
 */
Builder.prototype.fixPath = function (path) {
    return path.replace('/', path.sep);
}

/**
 * Build entry point
 */
Builder.prototype.run = function () {
    console.log("MaterialBlend Framework Builder v1.0\n");
    var me = this,
        argv = require('yargs')
            .command('build', 'Builds MaterialBlend and Tests')
            .command('copyright', 'Adds copyright headers to files')
            .demand(1)
            .epilog('Copyright 2016 TrueSoftware B.V.')
            .argv;

    var command = argv._[0];
    if (command === 'build') {
        me.buildFramework();
    } else if (command === 'copyright') {
        me.copyrightFiles(me.blendPath);
    }

}

var builder = new Builder();
builder.run();