/// <reference path="../blend/blend.d.ts" />

namespace Blend.testing {

    export class ConsoleLogger implements LoggerInterface {

        private logtext: string;
        private numAsserts = 0;
        private numPasses = 0;
        private numFailed = 0;

        open(): any {
            this.logtext = "<div class=\"container-fluid\"><table class=\"table table-bordered\" >"
                + "<thead><tr><th>Test</th><th>Log</th><th>Context</th></tr></thead><tbody>";
            this.info("Starting at " + (new Date()));
        }

        close(): any {

            var head: HTMLHeadElement = document.head
                , link: HTMLLinkElement = document.createElement("link");

            this.info(`<div class='status'><span class='total'>${this.numAsserts} ASSERTS</span><span class='pass'>${this.numPasses} PASSED</span><span class='fail'>${this.numFailed} FAILED</span></div>`);


            this.logtext += "</tbody></table></div>";
            var logEl: HTMLElement = document.createElement("div");
            logEl.innerHTML = this.logtext;
            document.body.innerHTML = "";
            document.body.appendChild(logEl);
        }

        private updateCounts(type: string) {
            var me = this;
            if (type === "pass" || type === "fail") {
                me.numAsserts += 1;
                if (type === "pass") {
                    me.numPasses += 1;
                } else {
                    me.numFailed += 1;
                }
            }
        }

        log(type: string, message: string, context?: any): any {

            this.updateCounts(type);

            if (type === "fail") {
                this.logtext += `<tr class="fail"><td>${context.test}</td><td>${message}</td><td><pre>${JSON.stringify(context, null, 2)}</pre></td></tr>`;
            } else if (type !== "pass") {
                this.logtext += `<tr class="${type}"><td colspan="3">${message}</td></tr>`;
            } else {
                console.log(type, message);
            }
        }

        warn(message: string, context?: any): any {
            this.log("warn", message, context);
        }

        error(message: string, context?: any): any {
            this.log("error", message, context);
        }

        info(message: string, context?: any): any {
            this.log("info", message, context);
        }

        debug(message: string, context?: any): any {
            this.log("debug", message, context);
        }

    }

}