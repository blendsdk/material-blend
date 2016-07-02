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
     * @private
     * Media Query registery that hold a lisneters for the Views
     * responding to a media query
      */
    interface IMediaQueryRegistery extends DictionaryInterface {
        [name: string]: Array<Function>;
    }

    /**
     * @private
     * Media Query matcher registery
     */
    interface IMediaQueryMatcher extends DictionaryInterface {
        [name: string]: MediaQueryList;
    }

    /**
     * Provides functionality to get Blend kickstarted and check for
     * brower compatibility
     */
    export class RuntimeSingleton {

        private readyCallbacks: Array<IReadCallback>;
        private kickStarted: boolean = false;
        private mediaQueryRegistery: IMediaQueryRegistery;
        private mediaQueryMatchers: IMediaQueryMatcher;
        private previousMediaQuery: string; // used to prevent multiple events of same alias

        public Binder: Blend.binding.BindingProvider;
        public IE: boolean;
        public IEVersion: number;

        public constructor() {
            this.Binder = new Blend.binding.BindingProvider();
            this.mediaQueryRegistery = {};
            this.mediaQueryMatchers = {};
        }

        /**
         * Used to trigger the media query matching on application.
         */
        public triggerMediaQueryCheck() {
            var me = this;
            Blend.forEach(me.mediaQueryMatchers, function (mql: MediaQueryList, mediaQuery: string) {
                if (mql.matches && me.previousMediaQuery !== mediaQuery) {
                    me.mediaQueryRegistery[mediaQuery].forEach(function (fn: Function) {
                        fn.apply(me, [mql]);
                    });
                    me.previousMediaQuery = mediaQuery;
                    return false;
                }
            });
        }

        /**
         * Adds a media query listener
         */
        public addMediaQueryListener(mediaQuery: string, listener: Function) {
            var me = this;
            if (me.mediaQueryRegistery[mediaQuery] === undefined) {
                me.mediaQueryRegistery[mediaQuery] = [];
                var mql: MediaQueryList = window.matchMedia(mediaQuery);
                me.mediaQueryMatchers[mediaQuery] = mql;
                mql.addListener(function () {
                    me.triggerMediaQueryCheck();
                });
            }
            me.mediaQueryRegistery[mediaQuery].push(listener);
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
         * Install a windows resize listener
         */
        public registerWindowResizeListener(listenerCallback: Function, scope: any) {
            var me = this, tm = -1,
                counts = 0,
                curSize = -1;
            Blend.Runtime.addEventListener(window, "resize", function (evt: Event) {
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
                }, 50);
            });
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
         * Adds an EventListener to an EventTarget. You can add multiple events by
         * providing event names seperated by spaces (eg. 'mouseup click')
         */
        public addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            if (eventName.indexOf(" ") !== -1) {
                eventName.split(" ").forEach(function (eName) {
                    eName = eName.trim();
                    if (eName.length !== 0) {
                        el.addEventListener(eName, eventHandler, false);
                    }
                });
            } else {
                el.addEventListener(eventName, eventHandler, false);
            }
        }

        /**
         * Removes an EventListener from an EventTarget. You can remove multiple events by
         * providing event names seperated by spaces (eg. 'mouseup click')
         */
        public removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            if (eventName.indexOf(" ") !== -1) {
                eventName.split(" ").forEach(function (eName) {
                    eName = eName.trim();
                    if (eName.length !== 0) {
                        el.removeEventListener(eName, eventHandler, false);
                    }
                });
            } else {
                el.removeEventListener(eventName, eventHandler, false);
            }
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