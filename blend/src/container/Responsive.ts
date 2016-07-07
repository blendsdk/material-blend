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



interface ResponsiveContainerInterface extends ContainerInterface {
    responsiveType?: Blend.eResponsiveType;
    /**
     * Defaukts to rem(1.6) or 16px according to MD specs
     */
    gutterSize?: number;
}

namespace Blend.container {

    export class Responsive extends Blend.container.Container {

        protected config: ResponsiveContainerInterface;
        protected currentBounds: ElementBoundsInterface;
        protected numColumns: number;
        protected sizeName: string;
        protected columnsSize: number;

        public constructor(config: ResponsiveContainerInterface = {}) {
            super(config);
            var me = this;
            Blend.apply(me.config, <ResponsiveContainerInterface>{
                responsiveType: config.responsiveType || Blend.eResponsiveType.windowSize,
                gutterSize: 16
            }, true, true);
            me.cssClass = "resp-cntr";
            me.bodyCssClass = "resp-cntr-body";
            me.childCssClass = "resp-cntr-item";
        }

        protected getBodyCssClass() {
            var me = this;
            return "resp-cntr-body resp-cntr-body-" + (window.getComputedStyle(document.body, null).getPropertyValue("direction") === "rtl" ? "rtl" : "ltr");
        }

        protected renderChildElement(materail: Blend.material.Material): Blend.dom.Element {
            // render without the explicit child size
            return materail.getElement(<FinalizeRenderConfig>{
                setBounds: false
            });
        }

        private getWindowSize(): ElementBoundsInterface {
            var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName("body")[0];
            return {
                width: w.innerWidth || e.clientWidth || g.clientWidth,
                height: w.innerHeight || e.clientHeight || g.clientHeight
            };
        }

        protected initNumberOfColumns() {
            var me = this,
                width = <number>me.currentBounds.width,
                count: number,
                name: string;
            if (width <= 479) {
                count = 4;
                name = "small";
            } else if (width >= 480 && width <= 839) {
                count = 8;
                name = "medium";
            } else if (width >= 840) {
                count = 12;
                name = "large";
            }
            me.numColumns = count;
            me.sizeName = name;
        }

        protected initCurrentBounds() {
            var me = this;
            me.currentBounds = (
                me.config.responsiveType === Blend.eResponsiveType.windowSize ?
                    me.getWindowSize() : me.bodyElement.getBounds(false)
            );
        }

        protected buildGridSystem() {
            var me = this,
                colSize = (100 / me.numColumns);

            me.withItems(function (item: Blend.material.Material) {
                item.setStyle({
                    width: 
                })
            });
        }

        protected updateLayout() {
            var me = this;
            me.initCurrentBounds();
            me.initNumberOfColumns();
            me.buildGridSystem();
        }

        protected windowResizeHandler() {
            var me = this;
            me.updateLayout();
        }

    }

}