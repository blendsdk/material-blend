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

import fs = require("fs");
import fse = require("fs-extra");
import path = require("path");
import childProcess = require("child_process");
import uglify = require("uglify-js");
import colors = require("colors");
import * as UtilityModule from "./Utility";
import os = require("os");

export class BlendBuilder extends UtilityModule.Utility {

    protected rootFolder: string;
    protected distPath: string;
    protected blendPath: string;
    protected buildPath: string;
    protected blendSourcePath: string;
    protected blendExternalPath: string;
    protected testPath: string;
    protected clientRepo: string;
    protected clientRepoFolder: string;
    protected distributeVersionSemver: string;
    protected frameworkVersion: string;

    public constructor(rootFolder: string) {
        super();
        var me = this;
        me.rootFolder = fs.realpathSync(rootFolder);
        me.buildPath = me.rootFolder + "/build";
        me.blendPath = me.rootFolder + "/blend";
        me.blendSourcePath = me.blendPath + "/src";
        me.blendExternalPath = me.blendPath + "/3rdparty";
        me.testPath = me.rootFolder + "/tests";
        me.distPath = me.rootFolder + "/dist";
        me.clientRepo = "git@github.com:blendsdk/material-blend-cli.git";
        me.clientRepoFolder = me.makePath(os.tmpdir() + "/blend-client");
    }

    /**
     * Cleanup the build folder. (Delete and Recreate and empty build folder!)
     */
    protected cleanBuild(callback: Function) {
        var me = this;
        try {
            me.print("Cleaning build folder, ");
            me.reCreateFolder(me.buildPath);
            me.printDone();
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
        me.print("Building Themes and Styles, ");
        childProcess.exec("compass compile", { cwd: me.blendPath }, function (error: Error, stdout: any, stderr: any) {
            if (!error) {
                me.printDone();
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
        me.print("Building Blend Framework, ");
        me.buildSources(me.blendPath, function (errors: string) {
            if (errors === null) {
                me.printDone();
            }
            callback.apply(me, [errors]);
        });
    }

    /**
     * Prepares the Tests application by deploying Blend
     */
    private prepareTests(callback: Function) {
        var me = this,
            testAppBlendFolder = me.makePath(me.testPath + "/blend"),
            testRunnerBlend = me.makePath(me.testPath + "/testrunner/blend");
        me.print("Building Tests, ");
        try {
            me.reCreateFolder(testAppBlendFolder);
            me.reCreateFolder(testRunnerBlend);
            me.copyFile(me.buildPath + "/blend/blend.d.ts", testAppBlendFolder + "/blend.d.ts");
            me.copyFile(me.buildPath + "/css", testRunnerBlend + "/css");
            me.copyFile(me.buildPath + "/blend/blend.js", testRunnerBlend + "/blend.js");
            me.buildSources(me.testPath, function (errors: string) {
                if (errors === null) {
                    me.printDone();
                }
                callback.apply(me, [errors]);
            });
        } catch (e) {
            callback.apply(me, [e]);
        }
    }

    /**
     * Places copyright headers in source files
     */
    protected copyrightFiles(folders: Array<string>, extensions: Array<string> = null) {
        var me = this,
            count = 0,
            header = fs.readFileSync(me.makePath(__dirname + "/../copyright.txt")),
            copyrightKey = "http://www.apache.org/licenses/LICENSE-2.0";
        me.print("Looking for files to copyright, ");
        extensions = extensions || [".ts", "scss"];
        folders.forEach(function (folder: string) {
            var files: Array<String> = me.findFiles(folder, function (fname: string) {
                var ext = path.extname(fname);
                return extensions.indexOf(ext) !== -1
                    && fname.indexOf(path.sep + "typings" + path.sep) === -1
                    && fname.indexOf(me.blendExternalPath) === -1;
            });
            files.forEach(function (fname: string) {
                var contents = fs.readFileSync(fname).toString();
                if (contents.indexOf(copyrightKey) === -1) {
                    contents = header + "\n\n" + contents;
                    fs.writeFileSync(fname, contents);
                    me.print(".");
                }
            });
        });
        me.printDone();
    }

    /**
     * Lint Blend Sources
     */
    private lintBlend(callback: Function) {
        var me = this,
            folders = [
                ["Blend", me.blendSourcePath, me.makePath(me.buildPath + "/lint-blend-issues.txt")],
                ["Builder", me.makePath(me.rootFolder + "/builder/src"), me.makePath(me.buildPath + "/lint-builder-issues.txt")]
            ],
            count: number = 0,
            queue: Array<Function> = [];

        folders.forEach(function (item: Array<string>) {
            queue.push(function (cb: Function) {
                me.print("Linting " + item[0] + ", ");
                me.lintFolder(item[1], function (error: string, numErrors: number) {
                    if (error) {
                        fs.writeFileSync(item[2], error);
                        me.print(` WE HAVE ${numErrors} ISSUE${numErrors === 1 ? "" : "S"}, `);
                    }
                    me.printDone();
                    count++;
                    cb.apply(me, [null]);
                });
            });
        });

        me.runSerial(queue, function () {
            if (count === folders.length) {
                callback.apply(me, [null]);
            }
        });

    }

    /**
     * Lint Blend Builder
     */
    private lintBlendBuilder(callback: Function) {
        var me = this;
        me.print("Linting Builder, ");
        me.lintFolder(me.makePath(me.rootFolder + "/builder/src"), function (error: string) {
            fs.writeFileSync(me.makePath(me.buildPath + "/lint-builder-issues.txt"), error);
            me.print(" WE HAVE ISSUES, ");
            me.printDone();
            callback.apply(me, [null]);
        });
    }

    /**
     * Builds the framework and prepares files for distribution
     */
    private buildFramework(callback: Function = null) {
        var me = this;

        callback = callback || function (errors: string) {
            if (errors) {
                me.println(colors.red("ERROR: " + errors));
            } else {
                me.printAllDone();
            }
        };

        me.runSerial([
            me.checkTypeScriptSanity
            , me.checkCompassSanity
            , me.checkCURLSanity
            , me.checkTSLintSanity
            , me.cleanBuild
            , me.buildStyles
            , me.lintBlend
            , me.buildBlend
            , me.prepareTests
        ], callback);
    }

    /**
     * Remove all copyright headers and inters just one
     */
    private cleanAndAddCopyright(file: string) {
        var me = this,
            header = fs.readFileSync(me.makePath(__dirname + "/../copyright.txt")).toString(),
            contents = fs.readFileSync(file).toString();
        contents = contents.split(header).join("\n");
        fs.writeFileSync(file, header + "\n" + contents);
    }

    private syncSubPackagesVersions() {

        var me = this,
            themePackagePath = me.makePath(me.blendPath + "/themes"),
            distPackagePath = me.makePath(me.rootFolder + "/dist"),
            themePackage = me.readNpmPackage(themePackagePath),
            distPackage = me.readNpmPackage(distPackagePath);

        themePackage.version = me.frameworkVersion;
        distPackage.version = me.frameworkVersion;

        fs.writeFileSync(me.makePath(themePackagePath + "/package.json"), JSON.stringify(themePackage, null, 4));
        fs.writeFileSync(me.makePath(distPackagePath + "/package.json"), JSON.stringify(distPackage, null, 4));
    }

    /**
     * Creates a new distribution (internal)
     */
    private createDistInternal(callback: Function) {
        var me = this,
            typingsFolder = me.makePath(me.distPath + "/typings"),
            webFolder = me.makePath(me.distPath + "/blend");
        try {

            me.println("Creating new dist");

            me.reCreateFolder(typingsFolder);
            me.reCreateFolder(webFolder);

            me.print("Processing typings, ");
            var dtFile = me.makePath(typingsFolder + "/blend.d.ts");
            me.copyFile(me.makePath(me.buildPath + "/blend/blend.d.ts"), dtFile);
            me.cleanAndAddCopyright(dtFile);
            me.printDone();

            var jsFolder = me.makePath((webFolder + "/js"));
            var cssFoder = me.makePath(webFolder + "/css");

            me.print("Creating a debug version, ");
            var debugJSFile = me.makePath(jsFolder + "/blend-debug.js");
            me.copyFile(me.makePath(me.buildPath + "/blend/blend.js"), debugJSFile);
            fse.copySync(me.makePath(me.buildPath + "/css"), cssFoder);
            me.findCSSFiles(cssFoder).forEach(function (file: string) {
                var renamedName = file.replace(".css", "-debug.css");
                fse.renameSync(file, renamedName);
                me.cleanAndAddCopyright(renamedName);
            });
            me.printDone();

            me.print("Creating a release version, ");
            var releaseFile = me.makePath(jsFolder + "/blend.min.js");
            me.minifyJSFileTo(debugJSFile, releaseFile, {
                mangle: false,
                compress: true
            });
            me.cleanAndAddCopyright(releaseFile);

            me.findCSSFiles(cssFoder).forEach(function (file: string) {
                var minCssFileName = file.replace("-debug.css", ".min.css");
                me.minifyCSSFileTo(file, minCssFileName, {
                    maxLineLen: 500
                });
                me.cleanAndAddCopyright(minCssFileName);
            });

            fs.writeFileSync(me.makePath(me.distPath + "/VERSION"), me.frameworkVersion);
            me.syncSubPackagesVersions();

            me.printDone();
            callback.apply(me, [null]);
        } catch (e) {
            callback.apply(me, [e]);
        }

    }

    /**
     * Creates a new distribution
     */
    private createDist(version: string) {
        var me = this,
            callback = function (errors: string) {
                if (errors) {
                    me.println(colors.red("ERROR: " + errors));
                } else {
                    me.println("Version: " + me.frameworkVersion);
                    me.printAllDone();
                }
            },
            bumpFrameworkVersion = function (callback: Function) {

                me.bumpPackageVersion(version, me.rootFolder, function () {
                    var bumpVersion: string;
                    bumpVersion = me.readNpmPackage(me.rootFolder).version;

                    // updating the Version.ts file;
                    var versionFileTs = me.makePath(me.blendSourcePath + "/Version.ts");
                    var contents = fs.readFileSync(versionFileTs)
                        .toString()
                        .split("\n");

                    for (var l = 0; l !== contents.length; l++) {
                        var line = contents[l];
                        if (line.indexOf("export var version") !== -1) {
                            contents[l] = `    export var version = "v${bumpVersion}";`;
                        }
                    }
                    me.frameworkVersion = bumpVersion;
                    fs.writeFileSync(versionFileTs, contents.join("\n"));
                });

                callback.apply(me, [null]);
            },
            tagRepository = function (callback: Function) {
                me.gitAddCommitAndTag(me.rootFolder, "", me.frameworkVersion, callback);
            };


        me.distributeVersionSemver = version;

        me.isGitRepoClean(me.rootFolder, function (isClean: boolean) {
            //            if (isClean) {
            me.runSerial([
                bumpFrameworkVersion
                , me.buildFramework
                , me.createDistInternal
                , tagRepository
            ], callback);
            //            } else {
            //                callback.apply(me, ["Cannot containue while the git repository has uncommited changes!"]);
            //            }
        });
    }

    /**
     * Entry point
     */
    public run() {
        var me = this;
        me.println(`\n${me.utilityPackage.description} v${me.utilityPackage.version}\n`);
        var buildFrameworkCommand = "buildfx",
            copyrightHeaderCommand = "copyright",
            makedistCommand = "makedist",
            argv = require("yargs")
                .command(buildFrameworkCommand, "Build the Framework and the Tests")
                .command(copyrightHeaderCommand, "Add coptyright headers to files")
                .command(makedistCommand, "Create a distribution", {
                    version: {
                        alias: "v",
                        demand: true,
                        describe: "Version and tag to publish"
                    }
                })
                .demand(1)
                .epilog("Copyright 2016 TrueSoftware B.V.")
                .argv;

        var command = argv._[0];
        if (command === buildFrameworkCommand) {
            me.buildFramework();
        } else if (command === copyrightHeaderCommand) {
            me.copyrightFiles([me.blendPath, me.makePath(__dirname + "/../src")]);
            me.printAllDone();
        } else if (command === makedistCommand) {
            me.createDist(argv.version);
        }

    }

}