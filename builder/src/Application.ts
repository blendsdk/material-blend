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

import * as Blend from "blend-node-library";
import yargs = require("yargs");

export class Application extends Blend.builder.Application {

    protected builderPackage: Blend.npm.Package;
    protected frameworkPackage: Blend.npm.Package;
    protected buildPath: string;
    protected blendPath: string;
    protected testPath: string;
    protected distPath: string;

    constructor(projectFolder: string) {
        super(projectFolder);
        var me = this;
        me.builderPackage = new Blend.npm.Package(__dirname + "/../");
        me.buildPath = me.filesystem.makePath(me.projectFolder + "/build");
        me.blendPath = me.filesystem.makePath(me.projectFolder + "/blend");
        me.testPath = me.filesystem.makePath(me.projectFolder + "/tests");
        me.distPath = me.filesystem.makePath(me.projectFolder + "/dist");
    }

    public run() {
        var me = this;
        me.println(`\n${me.builderPackage.description} v${me.builderPackage.version}\n`);
        var buildFrameworkCommand = "buildfx",
            makedistCommand = "makedist";

        var argv = yargs
            .command(buildFrameworkCommand, "Build the Framework and the Tests")
            .command(makedistCommand, "Create a distribution")
            // .command(makedistCommand, "Create a distribution", function () {
            //     return {
            //         version: {
            //             alias: "v",
            //             demand: true,
            //             describe: "Version and tag to publish"
            //         }
            //     };
            // }).demand(1)
            .epilog("Copyright 2016 TrueSoftware B.V.")
            .argv;

        var command = argv._[0];
        if (command === buildFrameworkCommand) {
            me.buildFrameworkCommand();
        } else if (command === makedistCommand) {
            //me.createDistribution((<any>argv).version);
            me.createDistributionCommand("patch");
        }
    }

    /**
     * Check if all build requirements are met
     */
    protected checkBuildRequirements(): boolean {
        var me = this,
            exeResult = me.checkTypeScriptSanity();
        if (exeResult.success) {
            exeResult = me.checkCompassSanity();
            if (exeResult.success) {
                exeResult = me.checkTSLintSanity();
                return true;
            }
        }
        if (exeResult.success === false) {
            me.printError(exeResult.result);
            return false;
        }
    }

    /**
     * Cleanup the build folder. (Delete and Recreate and empty build folder!)
     */
    protected cleanBuild() {
        var me = this;
        try {
            me.print("Cleaning build folder, ");
            me.filesystem.ensureFolder(me.buildPath, true);
            me.printDone();
            return true;
        } catch (e) {
            me.printError(e);
            return false;
        }
    }

    /**
     * Build the TS sources, both framework and tests
     */
    protected buildBlend(): boolean {
        var me = this;
        me.print("Building Blend Framework, ");
        var res = me.buildSources(me.blendPath);
        if (res.success) {
            me.printDone();
            return true;
        } else {
            me.printError(res.result);
            return false;
        }
    }

    /**
     * Prepares the Tests application by deploying Blend to
     * the TestRunner folder<
     */
    private buildTests() {
        var me = this,
            testAppBlendFolder = me.filesystem.makePath(me.testPath + "/blend"),
            testRunnerBlend = me.filesystem.makePath(me.testPath + "/testrunner/blend");
        me.print("Building Tests, ");
        try {
            me.filesystem.ensureFolder(testAppBlendFolder, true);
            me.filesystem.ensureFolder(testRunnerBlend, true);
            me.filesystem.copy(me.buildPath + "/blend/blend.d.ts", testAppBlendFolder + "/blend.d.ts");
            me.filesystem.copy(me.buildPath + "/css", testRunnerBlend + "/css");
            me.filesystem.copy(me.buildPath + "/blend/blend.js", testRunnerBlend + "/blend.js");
            var exeRes = me.buildSources(me.testPath);
            if (exeRes.success) {
                me.printDone();
                return true;
            } else {
                me.printError(exeRes.result);
                return false;
            }
        } catch (e) {
            me.printError(e);
            return false;
        }
    }

    /**
     * Compile the sass files
     */
    protected compileStyles(): boolean {
        var me = this;
        return me.buildStyles(me.blendPath);
    }

    /**
     * Entry point for building the framework
     */
    protected buildFrameworkCommand(): boolean {
        var me = this,
            result = false;
        me.println("Building the Framework");
        if (me.checkBuildRequirements()) {
            me.cleanBuild();
            if (me.buildBlend()) {
                if (me.compileStyles()) {
                    result = me.buildTests();
                }
            }
        }
        return result;
    }

    /**
     * Remove all copyright headers and inters just one
     */
    private cleanAndAddCopyright(file: string) {
        var me = this,
            header = me.filesystem.readFileText(me.filesystem.makePath(__dirname + "/../copyright.txt")),
            contents = me.filesystem.readFileText(file);
        contents = contents.split(header).join("\n");
        me.filesystem.writeFileText(file, header + "\n" + contents);
    }

    /**
     * Synchronize the SDL and Theme SDK package versions
     */
    private syncSubPackagesVersions() {

        var me = this,
            themePackagePath = me.filesystem.makePath(me.blendPath + "/themes"),
            distPackagePath = me.filesystem.makePath(me.projectFolder + "/dist"),
            themePackage = new Blend.npm.Package(themePackagePath),
            distPackage = new Blend.npm.Package(distPackagePath);

        themePackage.version = me.frameworkPackage.version;
        distPackage.version = me.frameworkPackage.version;

        me.filesystem.writeFileText(me.filesystem.makePath(themePackagePath + "/package.json"), JSON.stringify(themePackage, null, 4));
        me.filesystem.writeFileText(me.filesystem.makePath(distPackagePath + "/package.json"), JSON.stringify(distPackage, null, 4));
    }

    protected createDistributionCommand(semver: string, isProduction: boolean = false) {
        var me = this,
            typingsFolder = me.filesystem.makePath(me.distPath + "/typings"),
            webFolder = me.filesystem.makePath(me.distPath + "/blend"),
            currentBranchName = me.getGitCurrentBranchName(me.projectFolder);

        me.println(`Creating a ${semver} distribution`);
        if (me.buildFrameworkCommand()) {
            // prepare the dist folder
            me.filesystem.ensureFolder(typingsFolder, true);
            me.filesystem.ensureFolder(webFolder, true);

            me.print("Processing typings, ");
            var dtFile = me.filesystem.makePath(typingsFolder + "/blend.d.ts");
            me.filesystem.copy(me.filesystem.makePath(me.buildPath + "/blend/blend.d.ts"), dtFile);
            me.cleanAndAddCopyright(dtFile);
            me.printDone();

            var jsFolder = me.filesystem.makePath((webFolder + "/js"));
            var cssFoder = me.filesystem.makePath(webFolder + "/css");

            me.print("Creating a debug version, ");
            var debugJSFile = me.filesystem.makePath(jsFolder + "/blend-debug.js");
            me.filesystem.copy(me.filesystem.makePath(me.buildPath + "/blend/blend.js"), debugJSFile);
            me.filesystem.copy(me.filesystem.makePath(me.buildPath + "/css"), cssFoder);
            me.findCSSFiles(cssFoder).forEach(function (file: string) {
                var renamedName = file.replace(".css", "-debug.css");
                me.filesystem.rename(file, renamedName);
                me.cleanAndAddCopyright(renamedName);
            });
            me.printDone();

            me.print("Creating a release version, ");
            var releaseFile = me.filesystem.makePath(jsFolder + "/blend.min.js");
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
            me.printDone();

            me.print("Updateing framework version to: ");
            me.bumpPackageVersion(semver, me.projectFolder);
            me.frameworkPackage = new Blend.npm.Package(me.projectFolder);
            me.print(me.frameworkPackage.version + ", ");
            me.filesystem.writeFileText(me.filesystem.makePath(me.distPath + "/VERSION"), me.frameworkPackage.version);
            me.syncSubPackagesVersions();
            me.printDone();

            var registry = me.getNpmConfig("registry");
            var isProductionRegistry = registry.indexOf("registry.npmjs.org") !== -1;

            var publishPackages = function () {
                me.print("SDK, ");
                me.childProcess.execute(me.childProcess.makeCommand("npm"), ["publish"], { cwd: me.distPath });
                me.print("Theme SDK, ");
                me.childProcess.execute(me.childProcess.makeCommand("npm"), ["publish"], { cwd: me.filesystem.makePath(me.blendPath + "/themes") });
            };

            me.print(`Publishing in ${isProduction ? "PRODUCTION" : "DEVELOPMENT"} (${currentBranchName} to ${registry}): `);
            if (isProductionRegistry) {
                if (isProduction) {
                    publishPackages();
                } else {
                    me.print("SKIPPING NPM PUBLISH, ");
                }
            } else {
                publishPackages();
            }

            if (isProduction) {
                // the git stuff
                me.gitCommitAndTag("v" + me.frameworkPackage.version, `Updated for v${me.frameworkPackage.version} distribution.`);
                me.print(`${currentBranchName}, `);
                me.childProcess.execute("git", ["push", "origin", currentBranchName], { cwd: me.projectFolder });
                me.print("tags, ");
                me.childProcess.execute("git", ["push", "--tags"], { cwd: me.projectFolder });
            } else {
                me.print("SKIPPING GIT PUSH, ");
            }

            me.printDone();
        }
    }
}