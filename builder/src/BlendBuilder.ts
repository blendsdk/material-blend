
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
            me.printLog('Cleaning build folder, ');
            me.reCreateFolder(me.buildPath)
            me.printLogLn(colors.green("DONE."));
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
        me.printLog('Building Themes and Styles, ');
        childProcess.exec('compass compile', { cwd: me.blendPath }, function (error: Error, stdout: any, stderr: any) {
            if (!error) {
                me.printLogLn(colors.green("DONE."));
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
        me.printLog('Building Blend Framework, ');
        me.buildSources(me.blendPath, function (errors: string) {
            if (errors === null) {
                me.printLogLn(colors.green("DONE."));
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
        me.printLog('Building Tests, ');
        try {
            me.reCreateFolder(testAppBlendFolder);
            me.reCreateFolder(testRunnerBlend);
            me.copyFile(me.buildPath + '/blend/blend.d.ts', testAppBlendFolder + '/blend.d.ts');
            me.copyFile(me.buildPath + '/css', testRunnerBlend + '/css');
            me.copyFile(me.buildPath + '/blend/blend.js', testRunnerBlend + '/blend.js');
            me.buildSources(me.testPath, function (errors: string) {
                if (errors === null) {
                    me.printLogLn(colors.green("DONE."));
                }
                callback.apply(me, [errors]);
            })
        } catch (e) {
            callback.apply(me, [e]);
        }
    }

    /**
     * Builds the framework and prepares files for distribution
     */
    private buildFramework(callback: Function = null) {
        var me = this;

        callback = callback || function (errors: string) {
            if (errors) {
                me.printLogLn(colors.red('ERROR: ' + errors));
            } else {
                me.printLogLn(colors.green('ALL DONE.'));
            }
        }

        me.runSerial([
            me.checkTypeScriptSanity
            , me.checkCompassSanity
            , me.checkCURLSanity
            , me.cleanBuild
            , me.buildStyles
            , me.buildBlend
            //, me.getESPromiseLibrary
            , me.prepareTests,
        ], callback);
    }

    /**
     * Creates a new distribution
     */
    private createDist() {
        var me = this;
        me.printLogLn('Creating new dist');
        me.reCreateFolder(me.distPath);
        me.buildFramework(function () {
            console.log('-- Done');
        });
    }

    public xrun() {
        var me = this;
        me.checkTypeScriptSanity(function () {
            console.log(arguments);
            console.log(me.minTypeScriptVersion);
        });
    }

    /**
     * Entry point
     */
    public run() {
        var me = this;
        me.printLogLn(`\n${me.utilityPackage.description} v${me.utilityPackage.version}\n`);
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
            //me.copyrightFiles(me.blendPath);
        } else if (command == makedistCommand) {
            me.createDist();
        }

    }

}