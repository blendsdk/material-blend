namespace Builder {

    export class Application extends Blend.builder.Application {

        protected builderPackage: Blend.NPMPackage;
        protected buildPath: string;
        protected blendPath: string;
        protected testPath: string;
        protected distPath: string;

        constructor(projectFolder: string) {
            super(projectFolder);
            var me = this;
            me.buildPath = me.filesystem.makePath(me.projectFolder + "/build");
            me.blendPath = me.filesystem.makePath(me.projectFolder + "/blend");
            me.testPath = me.filesystem.makePath(me.projectFolder + "/tests");
            me.distPath = me.filesystem.makePath(me.projectFolder + "/dist");
        }

        /**
         * Prepares the Tests application by deploying Blend to
         * the TestRunner folder<
         */
        private prepareTests() {
            var me = this,
                exeRes: ExecueResult,
                testAppBlendFolder = me.filesystem.makePath(me.testPath + "/blend"),
                testRunnerBlend = me.filesystem.makePath(me.testPath + "/testrunner/blend");
            me.print("Building Tests, ");
            try {
                me.filesystem.reCreateFolder(testAppBlendFolder);
                me.filesystem.reCreateFolder(testRunnerBlend);
                me.filesystem.copy(me.buildPath + "/blend/blend.d.ts", testAppBlendFolder + "/blend.d.ts");
                me.filesystem.copy(me.buildPath + "/css", testRunnerBlend + "/css");
                me.filesystem.copy(me.buildPath + "/blend/blend.js", testRunnerBlend + "/blend.js");
                exeRes = me.buildSources(me.testPath);
                if (exeRes.success) {
                    me.printDone();
                    return true;
                } else {
                    me.printError(exeRes.result);
                    return false;
                }
            } catch (e) {
                me.printError(exeRes.result);
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
                me.filesystem.reCreateFolder(me.buildPath);
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

        protected buildFramework() {
            var me = this, exeRes: ExecueResult;
            me.println("Building the Framework");
            if ((exeRes = me.checkTypeScriptSanity()).success) {
                if ((exeRes = me.checkCompassSanity()).success) {
                    if (me.cleanBuild()) {
                        if (me.buildStyles(me.blendPath)) {
                            if (me.buildBlend()) {
                                if (me.prepareTests()) {

                                }
                            }
                        }
                    }
                }
            }

            if (!exeRes.success) {
                me.printError(exeRes.result);
            } else {
                me.printDone();
            }
        }

        protected copyrightSources() {
            var me = this;
            me.println("Copyright sources");
            me.printDone();
        }

        protected createDistribution(semver: string) {
            var me = this;
            me.println("Creating the distribution");
            me.buildFramework();
            me.printDone();
        }

        public run() {
            var me = this;
            me.builderPackage = new Blend.NPMPackage(__dirname + "/../");
            me.println(`\n${me.builderPackage.description} v${me.builderPackage.version}\n`);
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
                me.copyrightSources();
            } else if (command === makedistCommand) {
                me.createDistribution(argv.version);
            }
        }

    }
}
