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
        protected gutterSize: number;
        protected direction: string;

        public constructor(config: GridContainerInterface = {}) {
            super(config);
            var me = this;
            Blend.apply(me.config, <GridContainerInterface>{
                responsiveTrigger: config.responsiveTrigger || Blend.eResponsiveTrigger.containerSize,
                gutterSize: Blend.isNullOrUndef(config.gutterSize) ? 16 : config.gutterSize
            }, true, true);
            me.cssClass = "grid-cntr";
            me.bodyCssClass = "grid-cntr-body";
            me.childCssClass = "grid-cntr-item";
            me.direction = window.getComputedStyle(document.body, null).getPropertyValue("direction") === "rtl" ? "rtl" : "ltr";
        }

        protected getBodyCssClass() {
            var me = this;
            return "grid-cntr-body grid-cntr-body-" + me.direction;
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
                me.gutterSize = 16;
            } else if (width >= 480 && width <= 839) {
                count = 8;
                name = "medium";
                me.gutterSize = 16; // specs say 24 here!
            } else if (width >= 840) {
                count = 12;
                name = "large";
                me.gutterSize = 24;
            }
            me.numColumns = count;
            me.sizeName = name;
        }

        protected initCurrentBounds() {
            var me = this;
            me.currentBounds = (
                me.config.responsiveTrigger === Blend.eResponsiveTrigger.windowSize ?
                    me.getWindowSize() : me.bodyElement.getBounds(false)
            );
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

            var columnsSize = <number>me.currentBounds.width / me.numColumns,
                gutterHalf = me.gutterSize / 2,
                defConfig: GridColumnConfigInterface = {
                    small: me.numColumns,
                    medium: me.numColumns,
                    large: me.numColumns
                };

            me.withItems(function (item: Blend.material.Material) {

                var me = this,
                    itemGridConfig = item.getProperty<GridColumnConfigInterface>("config.grid", defConfig),
                    columnConfig = me.normalizeColumnConfig(
                        Blend.isNullOrUndef((<any>itemGridConfig)[me.sizeName])
                            ? defConfig[me.sizeName] : (<any>itemGridConfig)[me.sizeName]
                    ),
                    colSize = columnConfig.size * columnsSize,
                    offset = columnConfig.offset * columnsSize;

                if (colSize === me.numColumns) {
                    gutter = 0;
                } else {
                    gutter = gutterHalf;
                }

                item.setStyle({
                    width: (colSize - me.gutterSize),
                    "margin-left": gutter + (me.direction === "ltr" ? offset : 0),
                    "margin-right": gutter + + (me.direction === "rtl" ? offset : 0)
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