/// <reference path="./Builder.ts" />
/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/packages.d.ts"/>

var fs = require('fs');
var fse = require('fs-extra');
var del = require('del');
var path = require('path');
var childProcess = require('child_process');
var uglify = require('uglify-js');
var vercompare = require('version-comparison');

export class BlendBuilder extends Builder {

    public constructor(rootFolder: string) {
        super(rootFolder);
        var me = this;
        me.copyrightKey = 'Copyright 2016 TrueSoftware B.V';
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
        ];
    }

    /**
     * Build the themes and styles used external Compass
     */
    private buildStyles(callback: Function) {
        var me = this;
        console.log('-- Building Themes and Styles');
        childProcess.exec('compass compile', { cwd: me.blendPath }, function (error: string, stdout: any, stderr: any) {
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
    private buildBlend(callback: Function) {
        var me = this;
        console.log('-- Building Blend');
        childProcess.exec('tsc', { cwd: me.blendPath }, function (error: string, stdout: any, stderr: any) {
            if (!error) {
                callback.apply(me, [null]);
            } else {
                callback.apply(me, [stdout.toString()]);
            }
        });
    }


    private getESPromiseLibrary(callback: Function) {
        var me = this,
            files = [
                {
                    local: me.blendExteralPath + '/es6-promise/es6-promise.js',
                    remote: 'https://raw.githubusercontent.com/stefanpenner/es6-promise/master/dist/lib/es6-promise.js'
                },
                {
                    local: me.blendExteralPath + '/es6-promise/es6-promise.d.ts',
                    remote: 'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/es6-promise/es6-promise.d.ts'
                }
            ];
        me.downloadFiles(files, callback);
    }

    /**
     * Prepares the Tests application by deploying Blend
     */
    private prepareTests(callback: Function) {
        var me = this,
            testAppBlendFolder = me.fixPath(me.testPath + '/blend'),
            testRunnerBlend = me.fixPath(me.testPath + '/testrunner/blend');
        console.log('-- Preparing the Test Application');
        try {
            me.reCreateFolder(testAppBlendFolder);
            me.reCreateFolder(testRunnerBlend);
            me.copyFile(me.buildPath + '/blend/blend.d.ts', testAppBlendFolder + '/blend.d.ts');
            me.copyFile(me.buildPath + '/css', testRunnerBlend + '/css');
            me.copyFile(me.buildPath + '/blend/blend.js', testRunnerBlend + '/blend.js');
            callback.apply(me, [null]);
        } catch (e) {
            callback.apply(me, [e]);
        }
    }

    /**
     * Builds the framework and prepares files for distribution
     */
    private buildFramework() {
        var me = this;

        var done = function (errors: string) {
            if (errors) {
                console.log(errors)
            } else {
                console.log('-- Done');
            }
        }

        me.runSerial([
            me.checkTypeScriptSanity
            , me.checkCompassSanity
            , me.checkCURLSanity
            , me.cleanBuild
            , me.buildStyles
            , me.buildBlend
            , me.getESPromiseLibrary
            , me.prepareTests,
        ], done);
    }

    /**
     * Build entry point
     */
    public run() {
        console.log("MaterialBlend Framework Builder v1.0\n");
        var me = this,
            buildFrameworkCommand = 'buildfx',
            copyrightHeaderCommand = 'copyright',
            argv = require('yargs')
                .command(buildFrameworkCommand, 'Build the Framework and the Tests')
                .command(copyrightHeaderCommand, 'Add coptyright headers to files')
                .demand(1)
                .epilog('Copyright 2016 TrueSoftware B.V.')
                .argv;

        var command = argv._[0];
        if (command === buildFrameworkCommand) {
            me.buildFramework();
        } else if (command === copyrightHeaderCommand) {
            me.copyrightFiles(me.blendPath);
        }

    }
}