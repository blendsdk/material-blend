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

        protected content: Blend.material.Material;
        protected applicationBar: Blend.toolbar.ApplicationBar;
        protected leftNavigation: Blend.material.Material;
        protected rightNavigation: Blend.material.Material;

        protected leftNavElement: Blend.dom.Element;
        protected rightNavElement: Blend.dom.Element;
        protected contentElement: Blend.dom.Element;

        public constructor(config: MaterialApplicationInterface = {}) {
            super(config);
            var me = this;
            Blend.apply(me.config, <MaterialApplicationInterface>{
                content: Blend.isNullOrUndef(config.content) ? null : config.content,
                applicationBar: Blend.isNullOrUndef(config.applicationBar) ? null : config.applicationBar,
                // bottomBar: Blend.isNullOrUndef(config.bottomBar) ? null : config.bottomBar,
                leftNavigation: Blend.isNullOrUndef(config.leftNavigation) ? null : config.leftNavigation,
                rightNavigation: Blend.isNullOrUndef(config.rightNavigation) ? null : config.rightNavigation,
                // actionButton: Blend.isNullOrUndef(config.actionButton) ? null : config.actionButton,
            }, true, true);

            me.leftNavElement = null;
            me.rightNavElement = null;
            me.contentElement = null;

            me.createContent();
            me.createApplicationBar();
            me.createNevigations();
        }

        protected createNevigations() {
            var me = this;
            if (me.config.leftNavigation) {
                me.leftNavigation = Blend.createComponent<Blend.material.Material>(me.config.leftNavigation);
            }

            if (me.config.rightNavigation) {
                me.rightNavigation = Blend.createComponent<Blend.material.Material>(me.config.rightNavigation);
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
            if (!me.applicationBar || Blend.isInstanceOf(me.applicationBar, Blend.toolbar.ApplicationBar)) {
                throw new Error("Unable to create or an invalid ApplicationBar configuration!");
            }
        }

        protected createContent() {
            var me = this;
            me.content = Blend.createComponent<Blend.material.Material>(me.config.content);
            if (!me.content) {
                throw new Error("Unable to create a content component!");
            }
        }

        protected render(): Blend.dom.Element {
            var me = this,
                cb = new Blend.dom.ElementConfigBuilder(<CreateElementInterface>{
                    cls: "mb-application mb-material-application",
                    children: [
                        {
                            tag: "nav",
                            cls: ["mb-leftnav"]
                        },
                        {
                            tag: "main",
                            cls: ["mb-content"],
                        },
                        {
                            tag: "nav",
                            cls: ["mb-rightnav"]
                        }
                    ]
                });
            return Blend.dom.Element.create(cb);
        }
    }
}