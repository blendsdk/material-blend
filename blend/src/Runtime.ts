namespace Blend {

    /**
     * @private
     * Callback interface for the ready function
     */
    interface IReadCallback {
        fn: Function
        sc?: any
    }

    /**
     * Provides functionality to get Blend kickstarted and check for
     * brower compatibility
     */
    export class RuntimeSingleton {

        private readyCallbacks: Array<IReadCallback>;
        private kickStarted: boolean = false;

        private isSupportedBrowser(): boolean {
            var me = this,
                ie = me.detectIE();
            if (ie !== 0 && ie < 11) {
                document.write('<div id="noblend">Unable to run this application. Please upgrade your Internet Explorer to version 11 or above, otherwise use Google Chrome or Firefox!</div>');
                return false;
            } else {
                return true;
            }
        }

        /**
         * Resets the "ready" callback buffer
         */
        public reset() {
            var me = this;
            me.readyCallbacks = [];
        }

        /**
         * Adds a callback function to run when the browser is ready to go
         */
        ready(callback: Function, scope?: any) {
            var me = this;
            if (!me.readyCallbacks) {
                me.readyCallbacks = [];
            }
            me.readyCallbacks.push({
                fn: callback,
                sc: scope || me
            });
        }

        /**
         * Initiates Blend's application lifecycle by executing the callbacks
         * which are registered by {Environment.ready}. This function needs to called
         * to get a Blend application started.
         */
        kickStart() {
            var me = this,
                didRun = false,
                doCallback = function() {
                    if (didRun === false) {
                        didRun = true;
                        if (me.isSupportedBrowser()) {
                            Blend.forEach(me.readyCallbacks, function(item: IReadCallback) {
                                item.fn.apply(item.sc, []);
                            });
                        }
                    }
                    // empty the callbacks after running once incase we have late
                    // ready(...) calls later, so we don't run previous calls again.
                    me.readyCallbacks = [];
                };

            if (!me.kickStarted) {
                me.kickStarted = true;
                if (document.readyState === "complete") {
                    setTimeout(doCallback, 5);
                } else {
                    me.addEventListener(document, 'DOMContentLoaded', doCallback);
                    me.addEventListener(window, 'load', doCallback);
                }
            } else {
                setTimeout(doCallback, 5);
            }
        }

        /**
         * Adds an EventListener to an EventTarget
         */
        public addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.addEventListener(eventName, eventHandler, false);
        }

        /**
         * Removes an EventListener from an EventTarget
         */
        public removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.removeEventListener(eventName, eventHandler, false);
        }

        private detectIE(): number {
            // copyright http://codepen.io/gapcode/pen/vEJNZN
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            return 0;
        }
    }

    /**
     * Global reference to the RuntimeSingleton
     */
    export var Runtime = new RuntimeSingleton();
}