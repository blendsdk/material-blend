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

/**
 * Interface for configuring a Material Application
 */
interface MaterialApplicationInterface extends ApplicationInterface {
    content?: MaterialType;
    applicationBar?: MaterialType;
    bottomBar?: MaterialType;
    leftNavigation?: MaterialType;
    rightNavigation?: MaterialType;
    actionButton?: MaterialType;
}

namespace Blend.material {

    /**
     * This class implements an application structure based on
     * material design specs
     */
    export class Application extends Blend.application.Application {

        protected config: MaterialApplicationInterface;

        protected content: Blend.material.Material;
        protected applicationBar: Blend.toolbar.ApplicationBar;
        public leftNavigation: Blend.material.SideNavigation;
        protected rightNavigation: Blend.material.SideNavigation;
        protected bottomBar: Blend.material.Material;
        protected actionButton: Blend.button.Button;

        public constructor(config: MaterialApplicationInterface = {}) {
            super(config);
            var me = this;
            Blend.apply(me.config, <MaterialApplicationInterface>{
                content: Blend.isNullOrUndef(config.content) ? null : config.content,
                applicationBar: Blend.isNullOrUndef(config.applicationBar) ? null : config.applicationBar,
                bottomBar: Blend.isNullOrUndef(config.bottomBar) ? null : config.bottomBar,
                leftNavigation: Blend.isNullOrUndef(config.leftNavigation) ? null : config.leftNavigation,
                rightNavigation: Blend.isNullOrUndef(config.rightNavigation) ? null : config.rightNavigation,
                actionButton: Blend.isNullOrUndef(config.actionButton) ? null : config.actionButton,
                responsive: true
            }, true, true);

            me.createContent();
            me.createApplicationBar();
            me.createNevigations();
            me.createActionButton();
        }

        protected createActionButton() {
            var me = this;
            if (me.config.actionButton) {
                me.actionButton = Blend.createComponent<Blend.button.Button>(me.config.actionButton);
            }
        }

        protected createNevigations() {
            var me = this;
            if (me.config.leftNavigation) {
                me.leftNavigation = new Blend.material.SideNavigation({
                    parent: me,
                    component: Blend.createComponent<Blend.material.Material>(me.config.leftNavigation)
                });
            } else {
                me.leftNavigation = null;
            }

            if (me.config.rightNavigation) {
                me.rightNavigation = new Blend.material.SideNavigation({
                    parent: me,
                    component: Blend.createComponent<Blend.material.Material>(me.config.rightNavigation)
                });
            } else {
                me.rightNavigation = null;
            }

            if (me.config.bottomBar) {
                me.bottomBar = Blend.createComponent<Blend.material.Material>(me.config.bottomBar);
            }
        }

        protected createApplicationBar() {
            var me = this;
            if (me.config.applicationBar === null) {
                me.config.applicationBar = {
                    ctype: "mb.appbar"
                };
            }
            me.applicationBar = Blend.createComponent<Blend.toolbar.ApplicationBar>(me.config.applicationBar);
            me.applicationBar.addCssClass("mb-appbar");
            if (!me.applicationBar || !Blend.isInstanceOf(me.applicationBar, Blend.toolbar.ApplicationBar)) {
                throw new Error("Unable to create or an invalid ApplicationBar configuration!");
            }
        }

        protected postInitialize() {
            var me = this;
            me.applicationBar.doInitialize();
        }

        protected createContent() {
            var me = this;
            if (!me.config.content) {
                throw new Error("Unable to create a content component!");
            }
            me.content = Blend.createComponent<Blend.material.Material>(me.config.content);
        }


        protected finalizeRender(config: FinalizeRenderConfig = {}) {
            var me = this;
            super.finalizeRender(config);
            Blend.getElement(document.body).scrollState(Blend.eScrollState.vertical);
        }

        protected updateLayout() {
            var me = this;
            me.applicationBar.performLayout();
        }

        protected render(): Blend.dom.Element {
            var me = this,
                cb = new Blend.dom.ElementConfigBuilder(<CreateElementInterface>{
                    cls: "mb-mapp",
                    children: [
                        me.applicationBar.getElement(),
                        {
                            cls: "content"
                        }
                    ]
                });
            return Blend.createElement(cb);
        }
    }
}