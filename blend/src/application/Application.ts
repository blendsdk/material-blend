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
        protected mainView: Blend.material.Material;

        public constructor(config: ApplicationInterface = {}) {
            super(Blend.apply(config, <MaterialInterface>{
                responsive: true
            }));
            var me = this;
            me.isStarted = false;
            me.isResizing = false;
            me.config.theme = config.theme || "default";
            me.config.style = {}; // remove use provided styles
            me.config.mainView = config.mainView || null;
            me.config.fitMainView = config.fitMainView === false ? false : true;
            me.setContext(new Blend.mvc.Context());
            me.addCssClass("mb-application");
        }

        protected createMainView(config: MaterialType): Blend.material.Material {
            var me = this;
            if (config) {
                var view = <Blend.material.Material>Blend.createComponent(config);
                view.setContext(me.context);
                if (view.getProperty("useParentController", true) === true) {
                    view.addController(me.controllers);
                }
                if (me.config.fitMainView === true) {
                    view.addCssClass("mb-mainview-fit");
                }
                return view;
            } else {
                return null;
            }
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

        private setupWindowListeners() {
            var me = this;
            Blend.Runtime.registerWindowResizeListener(me.onWindowResize, me);
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

        protected postInitialize() {
            var me = this;
            me.mainView.doInitialize();
        }

        protected postUpdateLayout() {
            var me = this;
            me.mainView.performLayout();
        }

        protected render(): Blend.dom.Element {
            var me = this,
                cb = new Blend.dom.ElementConfigBuilder({
                    cls: "mb-application"
                });
            me.mainView = me.createMainView(me.config.mainView);
            if (me.mainView) {
                cb.addChild(me.mainView.getElement({
                    setBounds: me.config.fitMainView === true ? false : true,
                }));
            }
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
