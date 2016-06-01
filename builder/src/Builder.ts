/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/packages.d.ts" />


var fs = require('fs');
var fse = require('fs-extra');
var del = require('del');
var path = require('path');
var childProcess = require('child_process');
var uglify = require('uglify-js');
var vercompare = require('version-comparison');

interface DownloadInterface {
    remote: string;
    local: string;
}

export abstract class Builder {

    protected minCompassVersion: string;
    protected minTypeScriptVersion = '1.8.10';
    protected rootFolder: string;
    protected buildPath: string;
    protected blendPath: string;
    protected blendSourcePath: string;
    protected blendExteralPath: string;
    protected testPath: string;
    protected copyrightHeader: Array<string>;
    protected copyrightKey: string;

    public abstract run(): void;

    public constructor(rootFolder: string) {
        var me = this;
        me.minCompassVersion = '1.0.3';
        me.minTypeScriptVersion = '1.8.10';
        me.rootFolder = fs.realpathSync(rootFolder);
        me.buildPath = me.rootFolder + '/build';
        me.blendPath = me.rootFolder + '/blend';
        me.blendSourcePath = me.blendPath + '/src';
        me.blendExteralPath = me.blendPath + '/3rdparty';
        me.testPath = me.rootFolder + '/tests';
    }

    /**
     * Checks if a given fileExists
     */
    protected fileExists(path: string) {
        try {
            var stat = fs.statSync(path);
            if (stat) {
                return stat.isFile();
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    protected fixPath(value: string): string {
        return value.replace('/', path.sep);
    }

    /**
     * Copy file from source to dest
     */
    protected copyFile(source: string, dest: string) {
        var me = this,
            s = me.fixPath(source),
            d = me.fixPath(dest);
        console.log('--- Copying ' + s + ' to ' + d);
        fse.copySync(s, d);
    }

    /**
     * Recursively reads files from a given folder and applies a filter to
     * be able to exclude some files
     */
    protected readFiles(dir: string, filter: Function) {
        var me = this,
            results: Array<string> = [];
        filter = filter || function (fname: string) {
            return true;
        }
        var list = fs.readdirSync(dir)
        list.forEach(function (file: string) {
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


    protected downloadFile(source: string, dest: string, callback: Function) {
        var me = this,
            command = 'curl -o "' + dest + '" "' + source + '"' + (process.env.http_proxy || null ? ' --proxy "' + process.env.http_proxy + '"' : '');
        console.log('-- Downloading: ' + source)
        childProcess.exec(command, { cwd: me.rootFolder }, function (error: string, stdout: any, stderr: any) {
            if (!error) {
                if (me.fileExists(dest)) {
                    callback.apply(me, [true]);
                } else {
                    callback.apply(me, [false, dest + " was not created after running curl!\nThe command was " + command]);
                }
            } else {
                callback.apply(me, [false, 'Unable to download ' + source + ", due:" + error]);
            }
        });
    }

    /**
     * Run a series of functions sequentially and when done call the whenDone callback
     */
    protected runSerial(callbacks: Array<Function>, whenDone: Function) {
        var me = this;
        var makeCall = function (fn: Function, cb: Function) {
            return function (error: string) {
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
        var index: number = callbacks.length;
        var lastCall = whenDone;
        while ((index--) !== 0) {
            lastCall = makeCall(callbacks[index], lastCall);
        }
        lastCall.apply(me, []);
    }

    /**
     * Downloads files. This functionis function is used to download 3rdpart files
     */
    protected downloadFiles(files: Array<DownloadInterface>, callback: Function) {
        var me = this,
            count = 0,
            errors: Array<string> = [],
            queue: Array<Function> = [];
        files.forEach(function (file: DownloadInterface) {
            if (!fs.existsSync(file.local)) {
                queue.push(function (callback: Function) {
                    me.downloadFile(file.remote, file.local, function (status: boolean, error: string) {
                        if (status) {
                            count++;
                        } else {
                            errors.push(error);
                        }
                        callback.apply(me, [null]);
                    })
                });
            }
        });

        me.runSerial(queue, function () {
            if (count == files.length) {
                callback.apply(me, [null])
            } else {
                callback.apply(me, [errors.join("\n")]);
            }
        })
    }

    /**
     * Removes and recreates a folder
     */
    protected reCreateFolder(folder: string) {
        var me = this;
        console.log('--- Recreating ' + folder);
        if (me.dirExists(folder)) {
            del.sync(folder, {
                force: true
            });
        }
        fs.mkdirSync(folder);
    }

    /**
     * Checks if a goven directory exists
     */
    protected dirExists(path: string): boolean {
        try {
            var stat = fs.statSync(path);
            if (stat) {
                return stat.isDirectory();
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks if compass exists and it is the correct version.
     */
    protected checkCURLSanity(callback: Function) {
        var me = this;
        console.log('-- Checking CURL');
        childProcess.exec('curl -V', { cwd: me.rootFolder }, function (error: string, stdout: any, stderr: any) {
            if (!error) {
                callback.apply(me, [null]);
            } else {
                callback.apply(me, ['No CURL utility found!']);
            }
        });
    }

    /**
     * Checks if compass exists and it is the correct version.
     */
    protected checkCompassSanity(callback: Function) {
        var me = this;
        console.log('-- Checking Compass');
        childProcess.exec('compass -v', { cwd: me.rootFolder }, function (error: string, stdout: any, stderr: any) {
            if (!error) {
                var parts: Array<string> = stdout.split("\n");
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
    protected checkTypeScriptSanity = function (callback: Function) {
        var me = this;
        console.log('-- Checking TypeScript');
        childProcess.exec('tsc -v', { cwd: me.rootFolder }, function (error: string, stdout: any, stderr: any) {
            if (!error) {
                var parts: Array<string> = stdout.trim().split(" ");
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
    protected cleanBuild(callback: Function) {
        var me = this;
        try {
            console.log('-- Preparing');
            me.reCreateFolder(me.buildPath)
            callback.apply(me, [null]);
        } catch (e) {
            callback.apply(me, [e]);
        }
    }

    /**
     * Places copyright headers in source files
     */
    protected copyrightFiles = function (folder: string, extensions: Array<string> = null) {
        console.log('-- Looking for files');
        var me = this,
            count = 0,
            header = me.copyrightHeader.join("\n");
        extensions = extensions || ['.ts', 'scss'];
        var files: Array<String> = me.readFiles(folder, function (fname: string) {
            var ext = path.extname(fname);
            return extensions.indexOf(ext) !== -1
                && fname.indexOf(path.sep + 'typings' + path.sep) === -1;
        });
        files.forEach(function (fname: string) {
            var contents = fs.readFileSync(fname).toString();
            if (contents.indexOf(me.copyrightKey) === -1) {
                contents = header + "\n\n" + contents;
                fs.writeFileSync(fname, contents);
                console.log('-- Updated ' + fname);
            }
        });
        console.log('-- ' + count + ' files updated!');
        console.log('-- Done\n');
    }

}