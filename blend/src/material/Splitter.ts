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
        protected splitterType: Blend.eSplitterType;
        protected beforeComponent: Blend.material.Material;
        protected afterComponent: Blend.material.Material;
        protected splitterIndex: number;

        public constructor(config: SplitterInterface = {}) {
            super(config);
            var me = this;

            me.activeCssClass = "mb-splitter-active";
            me.hoverCssClass = "mb-splitter-hover";
            me.isActive = false;
        }

        public setIndex(value: number) {
            var me = this;
            me.splitterIndex = value;
        }

        public bindComponents(before: Blend.material.Material, after: Blend.material.Material) {
            var me = this;
            me.beforeComponent = before;
            me.afterComponent = after;
        }

        protected updateLayout() {
            var me = this;
            me.checkSetSplitterType();
            me.element.removeCssClass("mb-splitter-" + me.splitterType);
            me.element.addCssClass(["mb-splitter", "mb-splitter-" + me.splitterType]);
        }

        private checkSetSplitterType() {
            var me = this;
            me.splitterType = Blend.isInstanceOf(me.parent, Blend.container.HorizontalSplit)
                ? Blend.eSplitterType.horizontal : Blend.eSplitterType.vertical;

            if (me.splitterType === Blend.eSplitterType.vertical) {
                me.positionProperty = "left";
                me.sizeProperty = "width";
                me.movementProperty = "screenX";
            } else {
                me.positionProperty = "top";
                me.sizeProperty = "height";
                me.movementProperty = "screenY";
            }
            me.cursorCssClass = "mb-splitter-" + me.splitterType + "-cursor";
        }

        protected render(): Blend.dom.Element {
            var me = this;
            me.checkSetSplitterType();
            return Blend.dom.Element.create({
                style: {
                    "transition": "width 0.2s linear, height 0.2s linear, background-color 0.2s ease-in"
                },
                children: [
                    {
                        tag: "i",
                        cls: ["material-icons"],
                        text: me.splitterType === Blend.eSplitterType.vertical ? "more_vert" : "more_horiz"
                    }
                ]
            });
        }

        protected currentDisplacement: number;
        protected origin: ElementBoundsInterface;
        protected moveHandlerFn: EventListener;
        protected ghostEl: Blend.dom.Element;
        protected curPosition: ElementBoundsInterface;

        /**
         * Position the ghost element on top of this splitter
         */
        private positionGhost() {
            var me = this;
            if (!me.ghostEl) {
                me.createGhost();
            }
            var bounds = me.getBounds();
            me.ghostEl.setStyle({
                display: "flex",
                left: bounds.left,
                top: bounds.top,
            });
            me.curPosition = bounds;
        }

        /**
         * Create a ghost element that will act as a visual cue
         */
        private createGhost() {
            var me = this;
            me.ghostEl = new Blend.dom.Element(<HTMLElement>me.element.getEl().cloneNode(true));
            me.ghostEl.addCssClass("mb-splitter-ghost");
            me.element.getEl().parentElement.appendChild(me.ghostEl.getEl());
        }

        /**
         * Move the ghost element and enforce the minimal View sizes
         */
        private handleMovement(ev: MouseEvent) {
            var me = this,
                move: boolean = false,
                movementPosition = (<any>ev)[me.movementProperty],
                newSize: number,
                displacement = movementPosition - (<any>me.origin)[me.positionProperty];

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
                    me.ghostEl.setStyle({
                        [me.positionProperty]: (<any>me.curPosition)[me.positionProperty] + displacement
                    });
                }, 1);
            }
        }

        private activate(ev: MouseEvent) {
            var me = this;
            if (!me.isActive) {
                me.currentDisplacement = 0;
                me.isActive = true;
                me.origin = { top: ev.screenY, left: ev.screenX };
                //me.element.addCssClass([me.activeCssClass, me.cursorCssClass]);
                //me.element.removeCssClass([me.hoverCssClass]);
                me.positionGhost();
                //me.prepareMovementLimits();
                me.moveHandlerFn = function (ev: MouseEvent) {
                    me.handleMovement.apply(me, arguments);
                }
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
                me.element.removeCssClass([me.hoverCssClass, me.activeCssClass, me.cursorCssClass]);
                //@TODO
                me.resizeViews();
                Blend.Runtime.removeEventListener(document, "mousemove", me.moveHandlerFn);
                me.ghostEl.setStyle({ display: "none" });
                me.parent.performLayout();  // force to perform layout
            }
        }

        /**
         * Resizes the before and the after View by changes the View sizes
         */
        private resizeViews() {
            var me = this,
                reszie = Math.abs(me.currentDisplacement);
            if (me.currentDisplacement !== 0) {
                var splitPos = me.parent.getProperty<Array<number>>("splitPositions");
                if (me.currentDisplacement > 0) {
                    splitPos[me.splitterIndex] += reszie;
                } else {
                    splitPos[me.splitterIndex] -= reszie;
                }
                me.parent.performLayout();
            }
        }

        private initInteraction() {
            var me = this;
            me.element.addEventListener("mousedown", function (ev: MouseEvent) {
                me.activate.apply(me, arguments);
            });

            Blend.Runtime.addEventListener(document, "mouseup", function (ev: MouseEvent) {
                me.deActivate.apply(me, arguments);
            });
        }

        private initHoverEffect() {
            var me = this;
            me.element.addEventListener("mouseenter", function () {
                me.element.addCssClass([me.hoverCssClass, me.cursorCssClass]);
                me.parent.setProperty("activeSplitterIndex", me.splitterIndex);
                me.parent.performLayout();
            });

            me.element.addEventListener("mouseleave", function () {
                me.element.removeCssClass([me.hoverCssClass, me.cursorCssClass]);
                me.parent.setProperty("activeSplitterIndex", -1);
                me.parent.performLayout();
            });
        }

        protected postInitialize() {
            var me = this;
            me.initHoverEffect();
            me.initInteraction();
        }

        protected preInitialize() {
            var me = this;
            if (!Blend.isInstanceOf(me.parent, Blend.container.Split)) {
                throw new Error("The Splitter can only be hosted by a HorizontalSplit or a VerticalSplir container");
            }
        }
    }
}
