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

import fs = require('fs');
import fse = require('fs-extra');
import path = require('path');
import childProcess = require('child_process');
import uglify = require('uglify-js');
import colors = require('colors');
import * as UtilityModule from "./Utility";

export class BlendBuilder extends UtilityModule.Utility {

    protected rootFolder: string;
    protected distPath: string;
    protected blendPath: string;
    protected buildPath: string;
    protected blendSourcePath: string;
    protected blendExternalPath: string;
    protected testPath: string;

    public constructor(rootFolder: string) {
        super();
        var me = this;
        me.rootFolder = fs.realpathSync(rootFolder);
        me.buildPath = me.rootFolder + '/build';
        me.blendPath = me.rootFolder + '/blend';
        me.blendSourcePath = me.blendPath + '/src';
        me.blendExternalPath = me.blendPath + '/3rdparty';
        me.testPath = me.rootFolder + '/tests';
        me.distPath = me.rootFolder + '/dist';
    }

    /**
     * Cleanup the build folder. (Delete and Recreate and empty build folder!)
     */
    protected cleanBuild(callback: Function) {
        var me = this;
        try {
            me.print('Cleaning build folder, ');
            me.reCreateFolder(me.buildPath)
            me.printDone()
            callback.apply(me, [null]);
        } catch (e) {
            callback.apply(me, [e]);
        }
    }

    /**
     * Build the themes and styles used external Compass
     */
    private buildStyles(callback: Function) {
        var me = this;
        me.print('Building Themes and Styles, ');
        childProcess.exec('compass compile', { cwd: me.blendPath }, function (error: Error, stdout: any, stderr: any) {
            if (!error) {
                me.printDone()
                callback.apply(me, [null]);
            } else {
                callback.apply(me, [stdout.toString()]);
            }
        });
    }

    /**
     * Build the TS sources, both framework and tests
     */
    private buildBlend(callback: Function) {
        var me = this;
        me.print('Building Blend Framework, ');
        me.buildSources(me.blendPath, function (errors: string) {
            if (errors === null) {
                me.printDone()
            }
            callback.apply(me, [errors]);
        });
    }

    // private getESPromiseLibrary(callback: Function) {
    //     var me = this,
    //         files = [
    //             {
    //                 local: me.blendExteralPath + '/es6-promise/es6-promise.js',
    //                 remote: 'https://raw.githubusercontent.com/stefanpenner/es6-promise/master/dist/lib/es6-promise.js'
    //             },
    //             {
    //                 local: me.blendExteralPath + '/es6-promise/es6-promise.d.ts',
    //                 remote: 'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/es6-promise/es6-promise.d.ts'
    //             }
    //         ];
    //     me.downloadFiles(files, callback);
    // }

    /**
     * Prepares the Tests application by deploying Blend
     */
    private prepareTests(callback: Function) {
        var me = this,
            testAppBlendFolder = me.makePath(me.testPath + '/blend'),
            testRunnerBlend = me.makePath(me.testPath + '/testrunner/blend');
        me.print('Building Tests, ');
        try {
            me.reCreateFolder(testAppBlendFolder);
            me.reCreateFolder(testRunnerBlend);
            me.copyFile(me.buildPath + '/blend/blend.d.ts', testAppBlendFolder + '/blend.d.ts');
            me.copyFile(me.buildPath + '/css', testRunnerBlend + '/css');
            me.copyFile(me.buildPath + '/blend/blend.js', testRunnerBlend + '/blend.js');
            me.buildSources(me.testPath, function (errors: string) {
                if (errors === null) {
                    me.printDone()
                }
                callback.apply(me, [errors]);
            })
        } catch (e) {
            callback.apply(me, [e]);
        }
    }

    /**
     * Places copyright headers in source files
     */
    protected copyrightFiles = function (folders: Array<string>, extensions: Array<string> = null) {
        var me = this,
            count = 0,
            header = fs.readFileSync(me.makePath(__dirname + '/../copyright.txt')),
            copyrightKey = 'http://www.apache.org/licenses/LICENSE-2.0';
        me.print('Looking for files to copyright, ');
        extensions = extensions || ['.ts', 'scss'];
        folders.forEach(function (folder: string) {
            var files: Array<String> = me.findFiles(folder, function (fname: string) {
                var ext = path.extname(fname);
                return extensions.indexOf(ext) !== -1
                    && fname.indexOf(path.sep + 'typings' + path.sep) === -1
                    && fname.indexOf(me.blendExternalPath) === -1;
            });
            files.forEach(function (fname: string) {
                var contents = fs.readFileSync(fname).toString();
                if (contents.indexOf(copyrightKey) === -1) {
                    contents = header + "\n\n" + contents;
                    fs.writeFileSync(fname, contents);
                    me.print('.');
                }
            });
        });
        me.printDone();
    }

    /**
     * Builds the framework and prepares files for distribution
     */
    private buildFramework(callback: Function = null) {
        var me = this;

        callback = callback || function (errors: string) {
            if (errors) {
                me.println(colors.red('ERROR: ' + errors));
            } else {
                me.printAllDone();
            }
        }

        me.runSerial([
            me.checkTypeScriptSanity
            , me.checkCompassSanity
            , me.checkCURLSanity
            , me.cleanBuild
            , me.buildStyles
            , me.buildBlend
            , me.prepareTests,
        ], callback);
    }

    /**
     * Remove all copyright headers and inters just one
     */
    private cleanAndAddCopyright(file: string) {
        var me = this,
            header = fs.readFileSync(me.makePath(__dirname + '/../copyright.txt')).toString(),
            contents = fs.readFileSync(file).toString();
        contents = contents.split(header).join("\n");
        fs.writeFileSync(file, header + "\n" + contents);
    }

    /**
     * Creates a new distribution (internal)
     */
    private createDistInternal(callback: Function) {
        var me = this,
            typingsFolder = me.makePath(me.distPath + '/typings'),
            webFolder = me.makePath(me.distPath + '/web')
        try {

            me.println('Creating new dist');

            me.reCreateFolder(me.distPath);
            fs.mkdirSync(typingsFolder);
            fs.mkdirSync(webFolder);

            me.print('Processing typings, ');
            var dtFile = me.makePath(typingsFolder + '/blend.d.ts');
            me.copyFile(me.makePath(me.buildPath + '/blend/blend.d.ts'), dtFile);
            me.cleanAndAddCopyright(dtFile);
            me.printDone();

            var webFolder = me.makePath(me.distPath + '/web');
            var jsFolder = me.makePath((webFolder + '/js'));
            var cssFoder = me.makePath(webFolder + '/css');

            me.print('Creating a debug version, ');
            var debugJSFile = me.makePath(jsFolder + '/blend-debug.js')
            me.copyFile(me.makePath(me.buildPath + '/blend/blend.js'), debugJSFile);
            fse.copySync(me.makePath(me.buildPath + '/css'), cssFoder);
            me.findCSSFiles(cssFoder).forEach(function (file: string) {
                var renamedName = file.replace('.css', '-debug.css');
                fse.renameSync(file, renamedName);
                me.cleanAndAddCopyright(renamedName)
            });
            me.printDone();

            me.print('Creating a release version, ');
            var releaseFile = me.makePath(jsFolder + '/blend.min.js');
            me.minifyJSFileTo(debugJSFile, releaseFile, {
                mangle: false,
                compress: true
            });
            me.cleanAndAddCopyright(releaseFile);

            me.findCSSFiles(cssFoder).forEach(function (file: string) {
                var minCssFileName = file.replace('-debug.css', '.min.css');
                me.minifyCSSFileTo(file, minCssFileName, {
                    maxLineLen: 500
                });
                me.cleanAndAddCopyright(minCssFileName);
            });
            me.printDone();
            callback.apply(me, [null]);
        } catch (e) {
            callback.apply(me, [e]);
        }

    }

    /**
     * Creates a new distribution
     */
    private createDist() {
        var me = this,
            callback = function (errors: string) {
                if (errors) {
                    me.println(colors.red('ERROR: ' + errors));
                } else {
                    me.printAllDone();
                }
            }
        me.runSerial([
            me.buildFramework,
            me.createDistInternal
        ], callback);
    }

    /**
     * Entry point
     */
    public run() {
        var me = this;
        me.println(`\n${me.utilityPackage.description} v${me.utilityPackage.version}\n`);
        var me = this,
            buildFrameworkCommand = 'buildfx',
            copyrightHeaderCommand = 'copyright',
            makedistCommand = 'makedist',
            argv = require('yargs')
                .command(buildFrameworkCommand, 'Build the Framework and the Tests')
                .command(copyrightHeaderCommand, 'Add coptyright headers to files')
                .command(makedistCommand, 'Create a distribution')
                .demand(1)
                .epilog('Copyright 2016 TrueSoftware B.V.')
                .argv;

        var command = argv._[0];
        if (command === buildFrameworkCommand) {
            me.buildFramework();
        } else if (command === copyrightHeaderCommand) {
            me.copyrightFiles([me.blendPath, me.makePath(__dirname + '/../src')]);
            me.printAllDone();
        } else if (command == makedistCommand) {
            me.createDist();
        }

    }

}