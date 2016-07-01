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

        protected splitterType: Blend.eSplitterType;
        protected isActive: boolean;
        protected splitterIndex: number;
        protected beforeComponent: Blend.material.Material;
        protected afterComponent: Blend.material.Material;

        protected positionProperty: string;
        protected sizeProperty: string;
        protected movementProperty: string;
        protected currentDisplacement: number;
        protected origin: ElementBoundsInterface;
        protected moveHandlerFn: EventListener;
        protected curPosition: ElementBoundsInterface;

        public constructor(config: SplitterInterface = {}) {
            super(config);
            var me = this;
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
        }

        protected updateLayout() {
            var me = this,
                cls = "mb-splitter-" + me.splitterType;
            me.checkSetSplitterType();
            me.element.removeCssClass(cls);
            me.element.addCssClass(["mb-splitter", cls]);
        }

        protected ghostElement: Blend.dom.Element;
        protected ghostSize: number = 10;

        private createGhost() {
            var me = this;
            me.ghostElement = Blend.createElement({
                cls: ["mb-split-ghost", "mb-split-ghost-" + me.splitterType],
                style: {
                    [me.sizeProperty]: me.ghostSize
                },
                children: [
                    {
                        tag: "i",
                        cls: ["material-icons"],
                        text: me.splitterType === Blend.eSplitterType.vertical ? "more_vert" : "more_horiz"
                    }
                ]
            });
            me.ghostElement.addEventListener("mouseleave", function () {
                if (!me.isActive) {
                    me.hideGhost();
                }
            });
            me.ghostElement.addEventListener("mousedown", function (ev: MouseEvent) {
                me.activate.apply(me, arguments);
            });
            me.element.getEl().parentElement.appendChild(me.ghostElement.getEl());
        }

        private showGhost() {
            var me = this,
                bounds = me.getBounds();

            if (!me.ghostElement) {
                me.createGhost();
            }
            me.ghostElement.setStyle({
                [me.positionProperty]: <number>(<any>bounds)[me.positionProperty] - (me.ghostSize / 2),
                display: "flex",
            });
            setTimeout(function () {
                me.ghostElement.setStyle({
                    opacity: 1
                });
            }, 1);
            me.curPosition = me.ghostElement.getBounds();
        }

        private hideGhost() {
            var me = this;
            me.ghostElement.setStyle({
                opacity: 0,
                display: "none"
            });
        }

        private initHoverEffect() {
            var me = this;
            me.element.addEventListener("mouseenter", function () {
                me.showGhost();
            });
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
                    me.ghostElement.setStyle({
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
                //me.prepareMovementLimits();
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
                Blend.Runtime.removeEventListener(document, "mousemove", me.moveHandlerFn);
                me.hideGhost();
                me.resizeViews();
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
            Blend.Runtime.addEventListener(document, "mouseup", function (ev: MouseEvent) {
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
            if (!Blend.isInstanceOf(me.parent, Blend.container.Split)) {
                throw new Error("The Splitter can only be hosted by a HorizontalSplit or a VerticalSplir container");
            }
        }

    }
}