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

    export abstract class Box extends Blend.container.Container {

        protected config: BoxContainerInterface;
        protected stretchProperty: string;
        protected flexedProperty: string;

        constructor(config: BoxContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = "mb-box-cntr";
            Blend.apply(me.config, {
                reverse: config.reverse || false,
                wrap: Blend.isNullOrUndef(config.wrap) ? Blend.eBoxWrap.no : config.wrap,
                pack: Blend.isNullOrUndef(config.pack) ? Blend.eBoxPack.start : config.pack,
                align: Blend.isNullOrUndef(config.align) ? Blend.eBoxAlign.start : config.align
            }, true, true);
        }

        /**
         * Get the explicit size of child UI item
         */
        private getExplicitSize(material: Blend.material.Material): any {
            var me = this,
                el = material.getElement().getEl(),
                parse = function (value: string) {
                    return parseFloat(value.replace(/px|%/g, ""));
                },
                explicit: any = {
                    width: parse(el.style.width) || null,
                    height: parse(el.style.height) || null
                };
            return explicit;
        }

        protected updateLayout() {
            var me = this;
            me.bodyElement.clearCssClass();
            me.bodyElement.addCssClass(me.getBodyCssClass(), true);
            me.items.forEach(function (item: Blend.material.Material) {
                var flexConfig = item.getProperty<FlexItemInterface>("config.flex", null);
                var explicit = me.getExplicitSize(item);
                if (flexConfig) {
                    if (explicit[me.flexedProperty]) {
                        flexConfig = null; // flex and explicit = no flex
                    } else {
                        if (Blend.isNumberOrString(flexConfig)) {
                            flexConfig = {
                                grow: <any>flexConfig,
                                shrink: 0,
                                basis: "auto"
                            };
                        }
                    }
                }
                item.setProperty("config.flex", flexConfig);
                var flexValue = me.flexConfigToString(flexConfig);
                var styles: StyleInterface = {
                    "flex": flexValue,
                    "-webkit-flex": flexValue
                };
                if (me.config.align === Blend.eBoxAlign.stretch && !explicit[me.stretchProperty]) {
                    styles[me.stretchProperty] = null;
                }
                item.setStyle(styles);
            });
        }


        /**
         * Converts a given flexConfig to its string representation to be used
         * as a style value
         */
        protected flexConfigToString(flexConfig: FlexItemInterface): string {
            var me = this;
            if (!flexConfig) {
                return "none";
            } else {
                return `${flexConfig.grow || 0} ${flexConfig.shrink || 0} ${flexConfig.basis || "auto"}`;
            }
        }

        protected getBoxWrap() {
            var me = this;
            return `mb-box-wrap-${Blend.parseEnum(Blend.eBoxWrap, me.config.wrap)}`;
        }

        protected getBoxPack() {
            var me = this;
            return `mb-box-pack-${Blend.parseEnum<string>(Blend.eBoxPack, me.config.pack).toLowerCase()}`;
        }

        protected getBoxAlign() {
            var me = this;
            return `mb-box-align-${Blend.parseEnum<string>(Blend.eBoxAlign, me.config.align)}`;
        }

        protected getBodyCssClass() {
            var me = this;
            if (me.isRendered) {
                return `mb-box-cntr-body ${me.bodyCssClass}${me.config.reverse ? "-reverse" : ""} ${me.getBoxWrap()} ${me.getBoxPack()} ${me.getBoxAlign()}`;
            } else {
                return "mb-box-cntr-body";
            }
        }
    }
}