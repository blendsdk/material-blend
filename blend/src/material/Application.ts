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
        public leftNavigation: Blend.material.SideNavigation;
        protected rightNavigation: Blend.material.SideNavigation;
        protected bottomBar: Blend.material.Material;
        protected actionButton: Blend.button.Button;

        protected leftNavElement: Blend.dom.Element;
        protected rightNavElement: Blend.dom.Element;
        protected contentElement: Blend.dom.Element;

        private lastOrientation: Blend.eDeviceOrientation;


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

            me.leftNavElement = null;
            me.rightNavElement = null;
            me.contentElement = null;
            me.createContent();
            me.createApplicationBar();
            me.createNevigations();
            me.createActionButton();
        }

        private orientationChaned() {
            var me = this,
                result: boolean;
            if (me.lastOrientation === null) {
                me.lastOrientation = Blend.Runtime.getOrientation();
            }
            result = me.lastOrientation !== Blend.Runtime.getOrientation();
            me.lastOrientation = Blend.Runtime.getOrientation(); // update on call everytime
            return result;
        }

        protected windowResizeHandler() {
            var me = this;
            me.performLayout();
        }

        private updateLayoutLeft(style: string) {
            var me = this;
            if (me.leftNavElement) {
                var navBounds = me.leftNavElement.getBounds();

                if (style !== "m") {
                    me.contentElement.unmask();
                }

                if (style === "p") {
                    me.leftNavElement.setStyle({
                        "margin-left": null
                    });
                    me.contentElement.setStyle({
                        "margin-left": null,
                        "z-index": null
                    });
                } else if (style === "o" || style === "m") {
                    me.leftNavElement.setStyle({
                        "margin-left": 0
                    });
                    me.contentElement.setStyle({
                        "margin-left": -1 * <number>navBounds.width,
                        "z-index": -2
                    });
                    if (style === "m") {
                        Blend.delay(10, me.contentElement, me.contentElement.mask);
                    }
                } else if (style === "c") {
                    me.leftNavElement.setStyle({
                        "margin-left": -1 * <number>navBounds.width
                    });
                    me.contentElement.setStyle({
                        "margin-left": null,
                        "z-index": null
                    });
                }
            } else {
                me.contentElement.setStyle({
                    margin: 0
                });
            }
        }

        public updateLayout() {
            var me = this,
                deviceSize = Blend.Runtime.getDeviceSize();
            switch (deviceSize) {
                case Blend.eDeviceSize.large:
                    if (me.leftNavigation.isOpen() === null || me.leftNavigation.isOpen() === true) {
                        me.updateLayoutLeft("p");
                    } else {
                        me.updateLayoutLeft("c");
                    }
                    break;
                case Blend.eDeviceSize.medium:
                    if (me.leftNavigation.isOpen()) {
                        me.updateLayoutLeft(me.leftNavigation.isModal() ? "m" : "o");
                    } else {
                        me.updateLayoutLeft("c");
                    }
                    break;
                case Blend.eDeviceSize.small:
                    if (me.leftNavigation.isOpen()) {
                        me.updateLayoutLeft(me.leftNavigation.isModal() ? "m" : "o");
                    } else {
                        me.updateLayoutLeft("c");
                    }
                    break;
                default:
                    break;
            }
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
            if (!me.applicationBar || !Blend.isInstanceOf(me.applicationBar, Blend.toolbar.ApplicationBar)) {
                throw new Error("Unable to create or an invalid ApplicationBar configuration!");
            }
        }

        protected createContent() {
            var me = this;
            if (!me.config.content) {
                throw new Error("Unable to create a content component!");
            }
            me.content = Blend.createComponent<Blend.material.Material>(me.config.content);
        }

        protected render(): Blend.dom.Element {
            var me = this,
                el: Blend.dom.Element = Blend.createElement({
                    cls: "mb-material-application"
                });
            if (me.leftNavigation) {
                me.leftNavElement = me.leftNavigation.getElement();
                me.leftNavElement.addCssClass("leftnav");
                el.append(me.leftNavElement);
            }
            if (me.content) {
                me.contentElement = Blend.createElement({
                    cls: "content",
                    text: "This is the content",
                    style: {
                        "background-color": "yellow"
                    }
                });
                el.append(me.contentElement);
            }
            if (me.rightNavigation) {
                me.rightNavElement = me.rightNavigation.getElement();
                me.rightNavElement.addCssClass("rightnav");
                el.append(me.rightNavElement);
            }
            return el;
        }
    }
}