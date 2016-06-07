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

/// <reference path="../Typings.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../mvc/Context.ts" />
/// <reference path="../material/Material.ts" />

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
            me.config.mainView = config.mainView || null;
            me.config.theme = config.theme || "default";
            me.config.style = {}; // remove use provided styles
            me.setContext(new Blend.mvc.Context());
            me.createMainView();
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
            Blend.Runtime.addEventListener(window, "resize", function(evt: Event) {
                curSize = window.innerWidth + window.innerHeight;
                clearInterval(tm);
                tm = setInterval(function() {
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
                me.notifyApplicationReady();
                me.isStarted = true;
            }
        }

        /**
         * Creates the main view of this application
         * */
        protected createMainView() {
            var me = this;
            if (me.config.mainView) {
                me.mainView = Blend.createComponent<Blend.material.Material>(me.config.mainView, {
                    parent: me
                });
                if (Blend.isInstanceOf(me.mainView, Blend.material.Material)) {
                    me.setContext(me.context);
                    me.mainView.addCssClass("mb-mainview");
                    if (me.mainView.getProperty("useParentController", true) === true) {
                        me.mainView.addController(me.controllers);
                    }
                } else {
                    throw new Error("The provide mainView is not a valid View instance!");
                }
            } else {
                throw new Error("Missing or invalid mainView!");
            }
        }

        protected renderMainView(): Blend.dom.Element {
            return this.mainView.getElement();
        }

        protected finalizeRender() {
            var me = this;
            super.finalizeRender();
            /**
             * We cleanup the main view bounds to force it to fit into the application
             */
            me.mainView.setBounds({ top: null, left: null, width: null, height: null });
            me.mainView.setStyle({ display: null });
        }

        protected render(): Blend.dom.Element {
            var me = this;
            return Blend.dom.Element.create({
                cls: ["mb-application"],
                children: [me.renderMainView()]
            });
        }

        /**
         * Entry point of a Blend application
         */
        run() {
            var me = this;
            if (!me.isStarted) {
                Blend.Runtime.ready(function() {
                    me.asyncRun.apply(me, arguments);
                }, me);
                Blend.Runtime.kickStart();
            }
        }
    }
}
