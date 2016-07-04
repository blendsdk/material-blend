interface SplitInterface extends ContainerInterface {
    splitPosition?: (number | Array<number>) | (string | Array<string>);
    splitterSize?: number;
}

interface SizePositionInterface {
    size: number;
    position: number;
}

namespace Blend.container {

    export abstract class Split extends Blend.container.Container {

        protected config: SplitInterface;
        protected splitterType: Blend.eSplitterType;
        protected calculatedPositions: Array<number>;
        protected isPctPositions: boolean;
        protected sizeProperty: string;
        protected positionProperty: string;
        protected bounds: ElementBoundsInterface;
        protected activeSplitterIndex: number;

        protected resizeEventListener: EventListener;

        protected ghostElement: Blend.dom.Element;
        protected ghostHandlerElement: Blend.dom.Element;

        public constructor(config: SplitInterface = {}) {
            super(config);
            var me = this;
            me.ghostElement = null;
            me.ghostHandlerElement = null;
            me.cssClass = "split-cntr";
            me.childCssClass = "split-cntr-item";
            me.bodyCssClass = "split-cntr-body";
            me.activeSplitterIndex = -1;
            Blend.apply(me.config, {
                splitPosition: config.splitPosition || [],
                splitterSize: config.splitterSize || 2
            });
            me.config.splitPosition = <any>Blend.wrapInArray(me.config.splitPosition);
            me.calculatedPositions = [];
            me.initResizeEventListener();
        }

        protected createGhostElement() {
            var me = this;
            me.bodyElement.append(Blend.createElement({
                oid: "ghostElement",
                style: {
                    display: "none",
                    [me.sizeProperty]: me.splitterType
                },
                children: [
                    {
                        oid: "ghostHandlerElement",
                        tag: "i",
                        cls: ["material-icons"]
                    }
                ]
            }, me.assignElementByOID, me));
        }

        public hideGhost() {
            var me = this;
            me.ghostElement.setStyle({ display: "none" });
        }

        public showGhostAt(location: ElementBoundsInterface) {
            var me = this;
            me.ghostElement.setStyle({ display: "flex" });
        }

        protected finalizeRender(config: FinalizeRenderConfig = {}) {
            var me = this;
            super.finalizeRender(config);
            me.createGhostElement();
        }

        private initResizeEventListener() {
            var me = this;
            me.resizeEventListener = Blend.Runtime.createWindowResizeListener(function () {
                me.calculatedPositions = [];
                me.updateLayout();
            }, me);
            Blend.Runtime.addEventListener(window, "resize", me.resizeEventListener);
        }

        public destruct() {
            var me = this;
            Blend.Runtime.removeEventListener(window, "resize", me.resizeEventListener);
        }

        public setActiveSplitterIndex(value: number) {
            var me = this;
            me.activeSplitterIndex = value;
        }

        public getActiveSplitterIndex(): number {
            var me = this;
            return me.activeSplitterIndex;
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
            me.ghostElement.clearCssClass();
            me.ghostElement.addCssClass(["mb-split-ghost", "mb-split-ghost-" + me.splitterType]);
            me.ghostHandlerElement.setHtml(me.splitterType === Blend.eSplitterType.vertical ? "more_vert" : "more_horiz")
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
                noConfig: boolean = false,
                configSps = <Array<any>>me.config.splitPosition;

            if (me.calculatedPositions.length === 0) {
                // either no split positions or not yet calculated
                if (configSps.length === 0) {
                    // no split positions defined so we try to calculate automatically
                    var splitters = me.getSplitterCount(), pct = 0;
                    for (var a = 0; a !== splitters; a++) {
                        pct += (100 / (splitters + 1));
                        configSps.push(pct + "%");
                    }
                    noConfig = true;
                }
                if (configSps.length !== 0) {
                    // check for fixed or pct
                    me.isPctPositions = !Blend.isNumeric(configSps[0]);
                    if (me.isPctPositions) {
                        me.calculatedPositions = me.parsePercentageValues(configSps);
                        if (noConfig) {
                            me.config.splitPosition = configSps;
                        }
                    } else {
                        me.calculatedPositions = configSps;
                    }
                }
            }
        }

        /**
         * Updates the original splitPositions based on the newly splitted
         * positions if the original values where given as string.
         */
        public reflectCurrentPositions() {
            var me = this;
            if (me.isPctPositions) {
                var max: number = <number>(<any>me.bounds)[me.sizeProperty];
                me.config.splitPosition = [];
                me.calculatedPositions.forEach(function (pos: number) {
                    (<Array<string>>me.config.splitPosition).push(((100 * pos) / max) + "%");
                });
            }
        }

        protected updateLayout() {
            var me = this;
            if (Blend.isInstanceOf(me.parent, Blend.container.Split)) {
                setTimeout(function () {
                    me.updateLayoutInternal();
                }, 100);
            } else {
                me.updateLayoutInternal();
            }
        }

        public performPartialLayout() {
            var me = this;
            me.updateLayoutInternal();
        }

        protected updateLayoutInternal() {
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
                    posIndex.push({
                        position: me.calculatedPositions[splitterPos],
                        size: me.config.splitterSize
                    });
                    nextPosition = (me.calculatedPositions[splitterPos] + me.config.splitterSize);
                    posIndex[itemIndex - 1].size = (me.calculatedPositions[splitterPos]) - posIndex[itemIndex - 1].position;
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
            var max: number = <number>(<any>me.bounds)[me.sizeProperty];
            me.withItems(function (item: Blend.material.Material) {
                var req: number = (posIndex[itemIndex].size + posIndex[itemIndex].position);
                if (req > max) {
                    item.setVisible(false);
                } else {
                    item.setVisible(true);
                    item.setStyle({
                        [me.sizeProperty]: posIndex[itemIndex].size,
                        [me.positionProperty]: posIndex[itemIndex].position,
                    });
                }
                itemIndex++;
            });
        }

        protected getBodyCssClass() {
            var me = this;
            if (me.isRendered) {
                return `${me.bodyCssClass} ${me.bodyCssClass}-${me.splitterType}`;
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