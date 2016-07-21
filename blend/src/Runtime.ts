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

namespace Blend {

    /**
     * @private
     * Callback interface for the ready function
     */
    interface IReadCallback {
        fn: Function;
        sc?: any;
    }

    /**
     * Provides functionality to get Blend kickstarted and check for
     * brower compatibility
     */
    export class RuntimeSingleton {

        private readyCallbacks: Array<IReadCallback>;
        private kickStarted: boolean = false;
        private responsiveWindowResizeListener: EventListener;

        public Binder: Blend.binding.BindingProvider;
        public IE: boolean;
        public IEVersion: number;
        public Device: Blend.Device;

        public constructor() {
            var me = this;
            me.Device = new Blend.Device();
            me.Binder = new Blend.binding.BindingProvider();
        }

        /**
         * Checks if the current running environment supports device
         * orientation
         */
        public getOrientation(): Blend.eDeviceOrientation {
            var size = Blend.Runtime.getWindowSize();
            return size.width > size.height
                ? Blend.eDeviceOrientation.landscape
                : Blend.eDeviceOrientation.portrait;
        }

        /**
         * Gets the current Window size. The window size is calculated by the size of the BODY
         * tag which should be 100% x 100%
         */
        public getWindowSize(): ElementBoundsInterface {
            return Blend.getElement(document.getElementsByTagName("body")[0]).getBounds();
        }

        /**
         * Gets the device size as in small/medium/large base on the
         * provided width
         */
        public getDeviceSize(width: number = null): Blend.eDeviceSize {
            var me = this;
            width = width || <number>me.getWindowSize().width;
            if (width <= 479) {
                return Blend.eDeviceSize.small;
            } else if (width >= 480 && width <= 839) {
                return Blend.eDeviceSize.medium;
            } else if (width >= 840) {
                return Blend.eDeviceSize.large;
            } else {
                return null; // should never reach here!
            }
        }

        /**
         * Checks if the current browser is supported
          */
        private isSupportedBrowser(): boolean {
            var me = this,
                ie = me.detectIE();
            me.IE = ie !== 0;
            me.IEVersion = ie;
            if (ie !== 0 && ie < 11) {
                document.write("<div id=\"noblend\">Unable to run this application. Please upgrade your Internet Explorer to version 11 or above, otherwise use Google Chrome or Firefox!</div>");
                return false;
            } else {
                return true;
            }
        }

        /**
         * Creates a window resize listener. The resize trigger is debounced to get fewer
         * event callbacks for when the window resize is done manually
         */
        public createWindowResizeListener(listenerCallback: EventListener, scope: any) {
            return function (evt: Event) {
                var tm = -1,
                    counts = 0,
                    curSize = -1;
                curSize = window.innerWidth + window.innerHeight;
                clearInterval(tm);
                tm = setInterval(function () {
                    if (counts >= 3) {
                        if (curSize === (window.innerWidth + innerHeight)) {
                            clearInterval(tm);
                            listenerCallback.apply(scope, [evt]);
                        } else {
                            counts = 0;
                        }
                    } else {
                        counts++;
                    }
                }, 25);
            };
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
        ready(callback: Function, scope?: any): Blend.RuntimeSingleton {
            var me = this;
            if (!me.readyCallbacks) {
                me.readyCallbacks = [];
            }
            me.readyCallbacks.push({
                fn: callback,
                sc: scope || me
            });
            return this;
        }

        /**
         * Initiates Blend's application lifecycle by executing the callbacks
         * which are registered by {Environment.ready}. This function needs to called
         * to get a Blend application started.
         */
        kickStart() {
            var me = this,
                didRun = false,
                doCallback = function () {
                    if (didRun === false) {
                        didRun = true;
                        if (me.isSupportedBrowser()) {
                            Blend.forEach(me.readyCallbacks, function (item: IReadCallback) {
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
                    doCallback.apply(me, []);
                } else {
                    me.addEventListener(document, "DOMContentLoaded", doCallback);
                    me.addEventListener(window, "load", doCallback);
                }
            } else {
                doCallback.apply(me, []);
            }
        }

        /**
         * Adds an EventListener to an EventTarget.
         */
        public addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.addEventListener(eventName, eventHandler, false);
        }

        /**
         * Removes an EventListener from an EventTarget.
         */
        public removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.removeEventListener(eventName, eventHandler, false);
        }

        private detectIE(): number {
            // copyright http://codepen.io/gapcode/pen/vEJNZN
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
            }

            var trident = ua.indexOf("Trident/");
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf("rv:");
                return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
            }

            var edge = ua.indexOf("Edge/");
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
            }

            return 0;
        }
    }

    /**
     * Global reference to the RuntimeSingleton
     */
    export var Runtime = new RuntimeSingleton();
}