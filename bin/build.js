const fs = require('fs');
const del = require('del');
const path = require('path');
const childProcess = require('child_process');

function Builder() {
    var me = this;
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

Builder.prototype.buildFramework = function(callback) {
    var me = this;
    me.checkSanity(function(error) {
        if (!error) {
            me.cleanBuild(function(error) {
                if (!error) {
                    me.buildStyles(function(error) {
                        if (!error) {
                            me.buildBlend(function(error) {
                                if (!error) {
                                    callback.apply(me, [null])
                                } else {
                                    callback.apply(me, [error])
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

Builder.prototype.copyrightFiles = function() {
    console.log('-- Looking for files');
    var me = this,
        header = me.copyrightHeader.join("\n");
    files = me.readFiles(me.blendPath, function(fname) {
        var ext = path.extname(fname);
        return ext === '.ts' || ext === '.scss';
    });
    console.log('-- ' + files.length + ' files found.');
    files.forEach(function(fname) {
        var contents = fs.readFileSync(fname).toString();
        if (contents.indexOf('Copyright 2016 TrueSoftware B.V') === -1) {
            contents = header + "\n\n" + contents;
            fs.writeFileSync(fname, contents);
            console.log('-- Updated ' + fname);
        }
    });
}

Builder.prototype.readFiles = function(dir, filter) {
    var me = this,
        results = [];
    filter = filter || function(fname) {
        return true;
    }
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
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

Builder.prototype.run = function() {
    var me = this,
        argv = require('yargs')
            .command('build', 'Builds MaterialBlend and Tests')
            .command('copyright', 'Adds copyright headers to files')
            .demand(1)
            .help('h')
            .alias('h', 'help')
            .epilog('Copyright 2016 TrueSoftware B.V.')
            .argv;

    var command = argv._[0];
    if (command === 'build') {
        me.buildFramework(function() {
            console.log('-- Done.')
        })
    } else if (command === 'copyright') {
        me.copyrightFiles();
    }

}

var builder = new Builder();
builder.run();