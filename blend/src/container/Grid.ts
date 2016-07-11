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
                responsiveTrigger: config.responsiveTrigger || Blend.eResponsiveTrigger.windowSize,
                gutterSize: Blend.isNullOrUndef(config.gutterSize) ? 16 : config.gutterSize,
                responsive: true // force the Grdi to be responsize
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

        /**
         * @override
         */
        protected getDeviceSize(): Blend.eDeviceSize {
            // overridden to get the bodyElement bounds as size
            var me = this;
            me.currentBounds = me.bodyElement.getBounds(false);
            return super.getDeviceSize(me.bodyElement);
        }

        protected initNumberOfColumns() {
            var me = this,
                deviceSize = me.getDeviceSize();

            if (deviceSize === Blend.eDeviceSize.small) {
                me.numColumns = 4;
                me.sizeName = "small";
                me.gutterSize = 16;
            } else if (deviceSize === Blend.eDeviceSize.medium) {
                me.numColumns = 8;
                me.sizeName = "medium";
                me.gutterSize = 16; // specs say 24 here!
            } else if (deviceSize === Blend.eDeviceSize.large) {
                me.numColumns = 12;
                me.sizeName = "large";
                me.gutterSize = 24;
            }
        }

        /**
         * Normalizes the column configuration and places default values where needed
         */
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
                item.setVisible(!columnConfig.hide);
                item.setStyle({
                    width: (colSize - me.gutterSize),
                    "margin-left": gutter + (me.direction === "ltr" ? offset : 0),
                    "margin-right": gutter + + (me.direction === "rtl" ? offset : 0)
                });
                index++;
            });

        }

        /**
         * @override
         */
        protected windowResizeHandler() {
            var me = this;
            me.updateLayout();
        }

    }

}