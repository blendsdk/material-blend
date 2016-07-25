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

namespace Blend.material {

    /**
     * This class implements an application structure based on
     * material design specs
     */
    export class Application extends Blend.application.Application {

        protected config: MaterialApplicationInterface;
        // content?: MaterialType;
        // applicationBar?: MaterialType;
        // bottomBar?: MaterialType;
        // leftNavigation?: MaterialType;
        // rightNavigation?: MaterialType;
        // actionButton?: MaterialType;

        protected content: Blend.material.Material;
        protected applicationBar: Blend.toolbar.ApplicationBar;
        protected leftNavigation: Blend.material.SideNavigation;
        protected rightNavigation: Blend.material.SideNavigation;

        protected leftElement: Blend.dom.Element;
        protected centerElement: Blend.dom.Element;
        protected rightElement: Blend.dom.Element;


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
            }, true, true);
            me.createContent();
            me.createApplicationBar();
            // me.createBottomBar();
            me.createLeftNavigation();
            me.createRightNavigation();
            // me.createActionButton();
        }

        protected createContent() {
            var me = this;
            me.content = me.createComponentInternal<Blend.material.Material>(me.config.content);
            if (!me.content) {
                throw new Error("Unable to create a content component");
            }
        }

        protected createApplicationBar() {
            var me = this;
            me.applicationBar = me.createComponentInternal<Blend.toolbar.ApplicationBar>(me.config.applicationBar);
            if (!me.applicationBar) {
                me.applicationBar = me.createComponentInternal<Blend.toolbar.ApplicationBar>({
                    ctype: "mb.appbar"
                });
            } else if (!Blend.isInstanceOf(me.applicationBar, Blend.toolbar.ApplicationBar)) {
                throw new Error("Unable to create an ApplicationBar component");
            }
        }

        protected createLeftNavigation() {
            var me = this;
            me.leftNavigation = me.createComponentInternal<Blend.material.SideNavigation>(me.config.leftNavigation);
            if (me.leftNavigation && !Blend.isInstanceOf(me.leftNavigation, Blend.material.SideNavigation)) {
                throw new Error("Invalid component type for left navigation");
            }
        }

        protected createRightNavigation() {
            var me = this;
            me.rightNavigation = me.createComponentInternal<Blend.material.SideNavigation>(me.config.rightNavigation);
            if (me.rightNavigation && !Blend.isInstanceOf(me.rightNavigation, Blend.material.SideNavigation)) {
                throw new Error("Invalid component type for right navigation");
            }
        }

        private createComponentInternal<T>(config: MaterialType): T {
            var me = this;
            if (config) {
                // create the view anyway, we will check the type later
                var view = Blend.isInstanceOf(config, Blend.material.Material)
                    ? <Blend.material.Material>config
                    : <Blend.material.Material>Blend.createComponent(config);

                view.setContext(me.context);
                view.setProperty("parent", me);
                if (view.getProperty("useParentController", true) === true) {
                    view.addController(me.controllers);
                }

            } else {
                return null;
            }
        }


        protected postInitialize() {
            var me = this;
            // me.mainView.doInitialize();
        }

        protected postUpdateLayout() {
            var me = this;
            // me.mainView.setInLayoutContext(true);
            // me.mainView.performLayout();
            // me.mainView.setInLayoutContext(false);
        }

    }
}
