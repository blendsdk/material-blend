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

namespace Blend.application {

    /**
     * Base class for implementing an Application component
     */
    export abstract class Application extends Blend.container.Stack {

        protected config: ApplicationInterface;
        protected isStarted: boolean;
        protected isResizing: boolean;

        public constructor(config: ApplicationInterface = {}) {
            super(Blend.apply(config, <MaterialInterface>{
                responsive: true
            }));
            var me = this;
            me.isStarted = false;
            me.isResizing = false;
            me.config.theme = config.theme || "default";
            me.config.style = {}; // remove use provided styles
            me.setContext(new Blend.mvc.Context());
        }

        /**
         * Used to fire an event when the browser is resized
         */
        protected notifyApplicationResized(evt: Event) {
            var me = this;
            me.fireEvent("applicationResized", evt);
        }

        /**
         * Handle the resize notification correctly
         */
        protected onWindowResize() {
            var me = this;
            if (!me.isResizing) {
                me.isResizing = true;
                me.notifyApplicationResized.apply(me, arguments);
                me.isResizing = false;
            }
        }

        /**
         * Install an event listener on the window
         */
        protected setupWindowListeners() {
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
                            me.onWindowResize.apply(me, [evt]);
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
         * Fires when the application is ready for user interaction
         */
        protected notifyApplicationReady() {
            var me = this;
            me.fireEvent("applicationReady");
        }

        protected performInitialMediaQuery() {
            Blend.Runtime.triggerMediaQueryCheck();
        }

        protected asyncRun() {
            var me = this,
                body: Blend.dom.Element = Blend.getElement(document.body);
            if (!me.isStarted) {
                body.clearElement();
                body.addCssClass(me.config.theme, false);
                body.append(me.getElement());
                me.setupWindowListeners();
                me.performInitialMediaQuery();
                me.doInitialize();
                me.performLayout();
                me.notifyApplicationReady();
                me.isStarted = true;
            }
        }

        protected finalizeRender() {
            var me = this;
            super.finalizeRender({
                setBounds: false,
                setStyles: false
            });
        }

        /**
         * Entry point of a Blend application
         */
        run() {
            var me = this;
            if (!me.isStarted) {
                Blend.Runtime.ready(function () {
                    me.asyncRun.apply(me, arguments);
                }, me);
                Blend.Runtime.kickStart();
            }
        }
    }
}
