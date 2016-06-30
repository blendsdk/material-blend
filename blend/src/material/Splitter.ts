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

interface SplitterInterface {

}

namespace Blend.material {

    export class Splitter extends Blend.material.Material {

        protected activeCssClass: string;
        protected hoverCssClass: string;
        protected cursorCssClass: string;
        protected isActive: boolean;
        protected positionProperty: string;
        protected sizeProperty: string;
        protected movementProperty: string;
        protected splitterType: string;
        protected currentDisplacement: number;
        protected beforeView: Blend.material.Material;
        protected afterView: Blend.material.Material;
        protected beforeBounds: ElementBoundsInterface;
        protected afterBounds: ElementBoundsInterface;



        public constructor(config: SplitterInterface = {}) {
            super(config);
            var me = this;

            me.activeCssClass = "mb-splitter-active";
            me.hoverCssClass = "mb-splitter-hover";

            me.isActive = false;
        }

        protected updateLayout() {
            var me = this;
            me.checkSetSplitterType();
            me.element.clearCssClass();
            me.element.addCssClass(["mb-splitter", "mb-splitter-" + me.splitterType]);
        }

        private checkSetSplitterType() {
            var me = this;
            me.splitterType = Blend.isInstanceOf(me.parent, Blend.container.HorizontalBox) ? "hbox" : "vbox";
            if (me.splitterType === "hbox") {
                me.positionProperty = "left";
                me.sizeProperty = "width";
                me.movementProperty = "screenX";
            } else {
                me.positionProperty = "top";
                me.sizeProperty = "height";
                me.movementProperty = "screenY";
            }
            me.cursorCssClass = "mb.splitter-" + me.splitterType + "-cursor";
        }

        protected render(): Blend.dom.Element {
            var me = this;
            me.checkSetSplitterType();
            return Blend.dom.Element.create({
                children: [
                    {
                        tag: "i",
                        cls: ["material-icons"],
                        text: me.splitterType === "hbox" ? "more_vert" : "more_horiz"
                    }
                ]
            });
        }

        private initHoverEffect() {
            var me = this;
            me.element.addEventListener("mouseenter", function () {
                me.element.addCssClass(me.hoverCssClass);
            });

            me.element.addEventListener("mouseleave", function () {
                me.element.removeCssClass(me.hoverCssClass);
            });
        }

        protected origin: ElementBoundsInterface;
        protected moveHandlerFn: EventListener;


        /**
         * Move the ghost element and enforce the minimal View sizes
         */
        private handleMovement(ev: MouseEvent) {
            var me = this,
                move: boolean = false,
                movementPosition = (<any>ev)[me.movementProperty],
                newSize: number,
                displacement = movementPosition - (<any>me.origin)[me.positionProperty];

            console.log(displacement);

            // if (displacement < 0) {
            //     // towards before View
            //     move = ((<any>me.beforeBounds)[me.sizeProperty] - Math.abs(displacement)) > me.beforeSizeLimit;
            // } else if (displacement > 0) {
            //     // towards after View
            //     move = ((<any>me.afterBounds)[me.sizeProperty] - Math.abs(displacement)) > me.afterSizeLimit;
            // }

            move = true;

            if (move) {
                me.currentDisplacement = displacement;
                setTimeout(function () {
                    me.beforeView.setStyle({
                        [me.sizeProperty]: (<any>me.beforeBounds)[me.sizeProperty] + <any>displacement
                    });
                    me.afterView.setStyle({
                        [me.sizeProperty]: (<any>me.afterBounds)[me.sizeProperty] + <any>displacement
                    });
                    me.afterBounds = me.afterView.getBounds();
                    me.beforeBounds = me.beforeView.getBounds();
                }, 2);
            }
        }

        /**
         * Kicks in the splitter movement
         */
        private activate(ev: MouseEvent) {
            var me = this;
            if (!me.isActive) {
                me.currentDisplacement = 0;
                me.isActive = true;
                me.origin = { top: ev.screenY, left: ev.screenX };
                me.element.addCssClass([me.activeCssClass, me.cursorCssClass]);
                me.element.removeCssClass(me.hoverCssClass);

                me.beforeView = (<any>me.parent).items[0];
                me.afterView = (<any>me.parent).items[2];

                me.beforeBounds = me.beforeView.getBounds();
                me.beforeView.getElement().setStyle({
                    [me.sizeProperty]: (<any>me.beforeBounds)[me.sizeProperty],
                    flex: null,
                    "-webkit-flex": null
                });

                me.afterBounds = me.afterView.getBounds();
                me.afterView.getElement().setStyle({
                    [me.sizeProperty]: (<any>me.afterBounds)[me.sizeProperty],
                    flex: null,
                    "-webkit-flex": null
                });

                // @TODO
                // me.prepareMovementLimits();
                me.moveHandlerFn = function (ev: MouseEvent) {
                    me.handleMovement.apply(me, arguments);
                };
                Blend.Runtime.addEventListener(document, "mousemove", me.moveHandlerFn);
            }
        }

        /**
         * Finished the splitter movement
         */
        private deActivate(ev: MouseEvent) {
            var me = this;
            if (me.isActive) {
                me.isActive = false;
                me.element.removeCssClass([me.activeCssClass, me.cursorCssClass]);
                me.element.addCssClass(me.hoverCssClass);
                //me.resizeViews();
                Blend.Runtime.removeEventListener(document, "mousemove", me.moveHandlerFn);
            }
        }

        private initInteraction() {
            var me = this;
            me.element.addEventListener("mousedown", function (ev: MouseEvent) {
                me.activate.apply(me, arguments);
            });

            me.element.addEventListener("mouseup", function (ev: MouseEvent) {
                me.deActivate.apply(me, arguments);
            });
        }

        protected postInitialize() {
            var me = this;
            me.initHoverEffect();
            me.initInteraction();
        }

        protected preInitialize() {
            var me = this;
            if (!Blend.isInstanceOf(me.parent, Blend.container.Box)) {
                throw new Error("The Splitter can only be hosted by a HorizontalBox or a VerticalBox container");
            }
        }
    }
}

Blend.registerClassWithAlias("mb.splitter", Blend.material.Splitter);

