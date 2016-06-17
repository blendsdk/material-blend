import * as Blend from "blend-node-library";
import yargs = require("yargs");

export class Application extends Blend.builder.Application {

    protected builderPackage: Blend.npm.Package;

    constructor(projectFolder: string) {
        super(projectFolder);
        var me = this;
        me.builderPackage = new Blend.npm.Package(__dirname + "/../");
    }

    public run() {
        var me = this;
        me.println(`\n${me.builderPackage.description} v${me.builderPackage.version}\n`);
        var buildFrameworkCommand = "buildfx",
            copyrightHeaderCommand = "copyright",
            makedistCommand = "makedist";

        var argv = yargs
            .command(buildFrameworkCommand, "Build the Framework and the Tests")
            .command(copyrightHeaderCommand, "Add coptyright headers to files")
            .command(makedistCommand, "Create a distribution", {
                version: {
                    alias: "v",
                    demand: true,
                    describe: "Version and tag to publish"
                }
            }).demand(1)
            .epilog("Copyright 2016 TrueSoftware B.V.")
            .argv;

        var command = argv._[0];
        if (command === buildFrameworkCommand) {
            me.buildFrameworkCommand();
        } else if (command === copyrightHeaderCommand) {
            me.copyrightSourcesCommand();
        } else if (command === makedistCommand) {
            me.createDistribution((<any>argv).version);
        }
    }

    protected buildFrameworkCommand() {
        var me = this;
        me.println("Building the Framework");
    }

    protected copyrightSourcesCommand() {
        var me = this;
        me.println("Copyrighting the sources");

    }

    protected createDistribution(semver: string) {
        var me = this;
        me.println(`Creating a ${semver} distribution`);
    }
}