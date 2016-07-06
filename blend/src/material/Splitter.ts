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

    export class Splitter extends Blend.material.Material {

        protected movementProperty: string;
        protected sizeProperty: string;
        protected splitterIndex: number;
        protected beforeComponent: Blend.material.Material;
        protected afterComponent: Blend.material.Material;
        protected parent: Blend.container.Split;
        protected mouseOrigin: ElementBoundsInterface;

        protected afterBounds: ElementBoundsInterface;
        protected beforeBounds: ElementBoundsInterface;
        protected beforeSizeLimit: number;
        protected afterSizeLimit: number;

        protected positionProperty: string;

        protected mouseEnterListener: EventListener;

        protected initEvents() {
            var me = this;
            me.mouseEnterListener = Blend.bind(me, function (evt: MouseEvent) {
                if (me.parent.getActiveSplitterIndex() === -1) {
                    var bounds = me.getBounds();
                    me.parent.showGhostAt(me, {
                        [me.positionProperty]: <number>(<any>bounds)[me.positionProperty] - (me.parent.getGhostSize() / 2),
                    });
                }
            });

            Blend.Runtime.addEventListener(me.element.getEl(), "mouseenter", me.mouseEnterListener);
        }

        public destruct() {
            var me = this;
            Blend.Runtime.removeEventListener(me.element.getEl(), "mouseenter", me.mouseEnterListener);
        }

        public bindComponents(before: Blend.material.Material, after: Blend.material.Material) {
            var me = this;
            me.beforeComponent = before;
            me.afterComponent = after;
        }

        /**
         * Calculate the limita in which this splitter can move
         */
        private prepareMovementLimits() {
            var me = this;

            me.beforeBounds = me.beforeComponent.getBounds();
            me.afterBounds = me.afterComponent.getBounds();

            me.beforeSizeLimit = me.beforeComponent.getProperty<number>("config.minSplittedSize") || 5;
            me.afterSizeLimit = me.afterComponent.getProperty<number>("config.minSplittedSize") || 5;
        }

        public setMouseOrigin(bounds: ElementBoundsInterface) {
            var me = this;
            me.mouseOrigin = bounds;
            me.prepareMovementLimits();
        }

        public getIndex(): number {
            return this.splitterIndex;
        }

        public setIndex(value: number) {
            this.splitterIndex = value;
        }

        /**
         * Move the ghost element and enforce the minimal View sizes
         */
        public getMovement(evt: MouseEvent) {
            var me = this,
                move: boolean = false,
                movementPosition = (<any>evt)[me.movementProperty],
                newSize: number, limit: number,
                displacement = movementPosition - (<any>me.mouseOrigin)[me.positionProperty];

            if (displacement < 0) {
                // towards before View
                move = ((<any>me.beforeBounds)[me.sizeProperty] - Math.abs(displacement)) > me.beforeSizeLimit;
                limit = -1 * ((<any>me.beforeBounds)[me.sizeProperty] - me.beforeSizeLimit);
            } else if (displacement > 0) {
                // towards after View
                move = ((<any>me.afterBounds)[me.sizeProperty] - Math.abs(displacement)) > me.afterSizeLimit;
                limit = (<any>me.afterBounds)[me.sizeProperty] - me.afterSizeLimit;
            }

            return move ? displacement : limit;
        }

        protected updateLayout() {
            var me = this,
                spt = me.parent.getSplitterType(),
                cls = "mb-splitter-" + spt;

            me.movementProperty = spt === Blend.eSplitterType.vertical ?
                "screenX" : "screenY";

            me.sizeProperty = me.parent.getSizeProperty();

            me.positionProperty = me.parent.getPositionProperty();

            me.element.removeCssClass(cls);
            me.element.addCssClass(["mb-splitter", cls]);
        }

        protected preInitialize() {
            var me = this;
            if (!Blend.isInstanceOf(me.parent, Blend.container.Split)) {
                throw new Error("The Splitter can only be hosted by a HorizontalSplit or a VerticalSplir container");
            }
        }
    }
}
