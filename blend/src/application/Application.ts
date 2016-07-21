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
    export abstract class Application extends Blend.material.Material {

        protected config: ApplicationInterface;
        protected isStarted: boolean;
        protected isResizing: boolean;

        protected windowResizeEventListener: EventListener;

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
            me.addCssClass("mb-application");
        }

        /**
         * Used to fire an event when the browser is resized
         */
        protected notifyApplicationResized(evt: Event) {
            var me = this;
            me.fireEvent("applicationResized", evt);
        }

        public destruct() {
            var me = this;
            Blend.Runtime.removeEventListener(window, "resize", me.windowResizeEventListener);
        }

        private setupWindowListeners() {
            var me = this;
            me.windowResizeEventListener = Blend.Runtime.createWindowResizeListener(function () {
                if (!me.isResizing) {
                    me.isResizing = true;
                    me.notifyApplicationResized.apply(me, arguments);
                    me.isResizing = false;
                }
            }, me);
            Blend.Runtime.addEventListener(window, "resize", me.windowResizeEventListener);
        }

        /**
         * Fires when the application is ready for user interaction
         */
        protected notifyApplicationReady() {
            var me = this;
            me.fireEvent("applicationReady");
        }

        protected asyncRun() {
            var me = this,
                body: Blend.dom.Element = Blend.getElement(document.body);
            if (!me.isStarted) {
                body.clearElement();
                body.addCssClass(me.config.theme, false);
                body.append(me.getElement());
                me.setupWindowListeners();
                me.doInitialize();
                me.performLayout();
                me.notifyApplicationReady();
                me.isStarted = true;
            }
        }

        protected render(): Blend.dom.Element {
            var me = this,
                cb = new Blend.dom.ElementConfigBuilder({
                    cls: "mb-application"
                });
            return Blend.dom.Element.create(cb);
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
