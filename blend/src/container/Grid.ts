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



interface GridContainerInterface extends ContainerInterface {
    responsiveTrigger?: Blend.eResponsiveTrigger;
    /**
     * Defaults to rem(1.6) or 16px according to MD specs
     */
    gutterSize?: number;
}

namespace Blend.container {

    export class Grid extends Blend.container.Container {

        protected config: GridContainerInterface;
        protected currentBounds: ElementBoundsInterface;
        protected numColumns: number;
        protected sizeName: string;
        protected columnsSize: number;
        protected gutterSize: number;

        public constructor(config: GridContainerInterface = {}) {
            super(config);
            var me = this;
            Blend.apply(me.config, <GridContainerInterface>{
                responsiveTrigger: config.responsiveTrigger || Blend.eResponsiveTrigger.windowSize,
                gutterSize: Blend.isNullOrUndef(config.gutterSize) ? 16 : config.gutterSize
            }, true, true);
            me.cssClass = "grid-cntr";
            me.bodyCssClass = "grid-cntr-body";
            me.childCssClass = "grid-cntr-item";
        }

        protected getBodyCssClass() {
            var me = this;
            return "grid-cntr-body grid-cntr-body-" + (window.getComputedStyle(document.body, null).getPropertyValue("direction") === "rtl" ? "rtl" : "ltr");
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
            console.log(me.sizeName, me.numColumns);
        }

        protected initCurrentBounds() {
            var me = this;
            me.currentBounds = (
                me.config.responsiveTrigger === Blend.eResponsiveTrigger.windowSize ?
                    me.getWindowSize() : me.bodyElement.getBounds(false)
            );
        }

        protected buildGridSystem() {
            var me = this;
            me.columnsSize = ((<number>me.currentBounds.width / me.numColumns) * 100) / <number>me.currentBounds.width;
            me.gutterSize = (me.config.gutterSize * 100) / <number>me.currentBounds.width;
        }

        protected normalizeColumnConfig(value: number | GridColumnConfigValue): GridColumnConfigValue {
            var me = this,
                conf: GridColumnConfigValue = {};
            if (Blend.isNumeric(value)) {
                conf = {
                    size: <number>value,
                    offset: 0,
                    hide: false
                };
            } else {
                conf = {
                    size: (<GridColumnConfigValue>value).size || me.numColumns,
                    offset: (<GridColumnConfigValue>value).offset || 0,
                    hide: (<GridColumnConfigValue>value).hide || false,
                };
            }
            return conf;
        }

        protected updateLayout() {
            var me = this,
                index = 0,
                gutter = 0;

            me.initCurrentBounds();
            me.initNumberOfColumns();
            me.buildGridSystem();

            var defConfig: GridColumnConfigInterface = {
                small: me.numColumns,
                medium: me.numColumns,
                large: me.numColumns
            };

            me.withItems(function (item: Blend.material.Material) {

                var me = this,
                    itemGridConfig = item.getProperty<GridColumnConfigInterface>("config.grid", defConfig),
                    columnConfig = me.normalizeColumnConfig((<any>itemGridConfig)[me.sizeName]),
                    colSize = columnConfig.size * me.columnsSize;

                if (colSize === me.numColumns) {
                    gutter = 0;
                } else {
                    gutter = me.gutterSize / 2;
                }

                item.setStyle({
                    width: (colSize - (gutter * 2)) + "%",
                    "margin-left": gutter + "%",
                    "margin-right": gutter + "%"
                });
                index++;
            });

        }

        protected windowResizeHandler() {
            var me = this;
            me.updateLayout();
        }

    }

}