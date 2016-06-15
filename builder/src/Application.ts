namespace Builder {

    export class Application extends Blend.builder.Application {

        protected builderPackage: Blend.NPMPackage;
        protected buildPath: string;

        constructor(projectFolder: string) {
            super(projectFolder);
            var me = this;
            me.buildPath = me.filesystem.makePath(me.projectFolder + "/build");
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

        protected buildFramework() {
            var me = this, exeRes: ExecueResult;
            me.println("Building the Framework");
            if ((exeRes = me.checkTypeScriptSanity())) {
                if ((exeRes = me.checkCompassSanity())) {
                    if ((exeRes = me.checkTSLintSanity())) {
                        if (me.cleanBuild()) {
                            
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
