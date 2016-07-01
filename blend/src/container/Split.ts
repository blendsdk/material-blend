interface SplitInterface extends ContainerInterface {
    splitPosition?: (number | Array<number>) | (string | Array<string>);
    splitterSize?: number;
    splitterActiveSize?: number;
}

interface SizePositionInterface {
    size: number;
    position: number;
}

namespace Blend.container {



    export abstract class Split extends Blend.container.Container {

        protected config: SplitInterface;
        protected splitType: string;
        protected splitPositions: Array<number>;
        protected sizeProperty: string;
        protected positionProperty: string;
        protected bounds: ElementBoundsInterface;
        protected splitterSize: number;
        protected activeSplitterIndex: number;

        public constructor(config: SplitInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = "split-cntr";
            me.childCssClass = "split-cntr-item";
            me.bodyCssClass = "split-cntr-body";
            me.splitterSize = 1;
            Blend.apply(me.config, {
                splitPosition: config.splitPosition || [],
                splitterSize: config.splitterSize || 2,
                splitterActiveSize: config.splitterActiveSize || 8
            });
            me.config.splitPosition = <any>Blend.wrapInArray(me.config.splitPosition);
            me.splitPositions = [];
            Blend.Runtime.registerWindowResizeListener(function () {
                me.splitPositions = [];
                me.updateLayout();
            }, me);
        }

        protected postUpdateLayout() {
            var me = this;
            super.postUpdateLayout();
            // update any child Split container. This is needed because
            // the Split conrainer does not automatically act on its
            // parent component's size change
            me.withItems(function (material: Blend.material.Material) {
                if (Blend.isInstanceOf(material, Blend.container.Split)) {
                    material.performLayout();
                }
            });
        }

        /**
         * Converts the string percentage representation to its corresponding
         * px values
         */
        private parsePercentageValues(values: Array<string>): Array<number> {
            var me = this,
                val: number,
                result: Array<number> = [];
            values.forEach(function (value: string) {
                val = (parseFloat(value.replace(/%/g, "")) * (<any>me.bounds)[me.sizeProperty]) / 100;
                result.push(val - 4);
            });
            return result;
        }

        protected calculateSplitPositions() {
            var me = this,
                fixed: boolean,
                configSps = <Array<any>>me.config.splitPosition;

            if (me.splitPositions.length === 0) {
                // either no split positions or not yet calculated
                if (configSps.length === 0) {
                    // no split positions defined so we try to calculate automatically
                    var splitters = me.getSplitterCount(), pct = 0;
                    for (var a = 0; a !== splitters; a++) {
                        pct += (100 / (splitters + 1));
                        configSps.push(pct + "%");
                    }
                }
                if (configSps.length !== 0) {
                    // check not fixed ot pct
                    fixed = Blend.isNumeric(configSps[0]);
                    if (!fixed) {
                        me.splitPositions = me.parsePercentageValues(configSps);
                    } else {
                        me.splitPositions = configSps;
                    }
                }
            }
        }

        protected updateLayout() {
            var me = this,
                splitterPos = 0,
                itemIndex: number = 0,
                nextPosition: number = 0,
                posIndex: Array<SizePositionInterface> = [];

            me.bodyElement.clearCssClass();
            me.bodyElement.addCssClass(me.getBodyCssClass(), true);
            me.bounds = me.bodyElement.getBounds();
            me.calculateSplitPositions();
            me.withItems(function (item: Blend.material.Material) {
                if (itemIndex % 2) {
                    var spSize = splitterPos === me.activeSplitterIndex ? me.config.splitterActiveSize : me.config.splitterSize;
                    posIndex.push({
                        position: me.splitPositions[splitterPos],
                        size: spSize
                    });
                    nextPosition = (me.splitPositions[splitterPos] + spSize);
                    posIndex[itemIndex - 1].size = (me.splitPositions[splitterPos]) - posIndex[itemIndex - 1].position;
                    splitterPos++;
                } else {
                    if (itemIndex === 0) {
                        posIndex.push({
                            position: 0,
                            size: -1
                        });
                    } else if (itemIndex === me.items.length - 1) {
                        posIndex.push({
                            position: nextPosition,
                            size: <number>(<any>me.bounds)[me.sizeProperty] - (nextPosition)
                        });
                    } else {
                        posIndex.push({
                            position: nextPosition,
                            size: -1
                        });
                    }
                }
                itemIndex++;
            });
            itemIndex = 0;
            me.withItems(function (item: Blend.material.Material) {
                item.setStyle({
                    [me.sizeProperty]: posIndex[itemIndex].size,
                    [me.positionProperty]: posIndex[itemIndex].position,
                });
                itemIndex++;
            });
        }

        protected getBodyCssClass() {
            var me = this;
            if (me.isRendered) {
                return `${me.bodyCssClass} ${me.bodyCssClass}-${me.splitType}`;
            } else {
                return me.bodyCssClass;
            }
        }

        protected getSplitterCount() {
            var me = this,
                count = 0;
            me.withItems(function (material: Blend.material.Material) {
                if (Blend.isInstanceOf(material, Blend.material.Splitter)) {
                    count++;
                }
            });
            return count;
        }

        protected createChildComponents(components: Array<MaterialType>): Array<Blend.material.Material> {
            // override to place the splitters in between the UI components
            var me = this,
                sIndex: number = 0,
                list = super.createChildComponents(components),
                result: Array<Blend.material.Material> = [];
            if (list.length === 1) {
                return list;
            } else {
                Blend.forEach(list, function (component: Blend.material.Material, index: number) {
                    if (index !== 0) {
                        var splitter = new Blend.material.Splitter();
                        splitter.setIndex(sIndex);
                        splitter.bindComponents(result[result.length - 1], component);
                        result.push(splitter);
                        result.push(component);
                        sIndex++;
                    } else {
                        result.push(component);
                    }
                });
                return result;
            }
        }
    }

}