
/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="ContainerView.ts" />
/// <reference path="BoxProcessor.ts" />

namespace Blend.ui {

    /**
     * Base class that is used to implement a container providing a Boxed
     * layout
     */
    export abstract class BoxContainerView extends PaddableContainer {

        private calculateMargins: boolean;
        protected config: BoxContainerInterface;
        protected boxProcessor: Blend.ui.BoxProcessor;
        protected boxedProperty: string;
        protected sizeProperty: string;
        protected marginBeforeProperty: string;
        protected marginAfterProperty: string;
        protected align: eBoxLayoutAlign;
        protected pack: eBoxLayoutPack;
        protected defaultItemMargin: number | BoxLayoutMarginInterface;
        protected direction: eBoxLayoutDirection;
        protected allowScroll: boolean;
        protected itemsLayoutContext: Array<BoxLayoutItemContextInterface>;

        public constructor(config: BoxContainerInterface = {}) {
            super(config);
            var me = this;
            me.calculateMargins = true;
            me.align = config.align || eBoxLayoutAlign.start;
            me.pack = config.pack || eBoxLayoutPack.start;
            me.defaultItemMargin = config.defaultItemMargin || null;
            me.allowScroll = config.allowScroll || false;
        }

        /**
         * Here we create a layout contextx for each View (splitters included). The result
         * of this function is fed to a BoxProcessor
         */
        private createItemsLayoutContext(layoutContext: BoxLayoutContextInterface): Array<BoxLayoutItemContextInterface> {
            var me = this,
                result: Array<BoxLayoutItemContextInterface> = [],
                mrgBefore: number,
                mrgAfter: number,
                flex: number,
                viewBounds: ElementBoundsInterface,
                ctx: BoxLayoutItemContextInterface,
                margins: BoxLayoutMarginInterface;

            Blend.forEach(me.items, function(view: Blend.ui.View, index: number) {
                viewBounds = view.getBounds();
                mrgBefore = mrgAfter = 0;
                if (me.calculateMargins) {
                    margins = view.getProperty<BoxLayoutMarginInterface>('margins') || me.defaultItemMargin || null;
                    if (Blend.isObject(margins)) {
                        mrgBefore = (<any>margins)[me.marginBeforeProperty] || 0;
                        mrgAfter = (<any>margins)[me.marginAfterProperty] || 0;
                    } else if (Blend.isNumeric(margins)) {
                        mrgBefore = mrgAfter = <number>margins;
                    } else {
                        mrgBefore = mrgAfter = 0;
                    }
                }
                flex = view.getProperty<number>('flex') || 0;
                ctx = {
                    flex: flex > 0 ? true : false,
                    flexSize: flex > 0 ? flex : 0,
                    marginBefore: mrgBefore,
                    marginAfter: mrgAfter,
                    [me.boxedProperty]: (<any>viewBounds)[me.boxedProperty],
                    [me.sizeProperty]: (<any>viewBounds)[me.sizeProperty]
                };
                if (flex > 0) {
                    layoutContext.allowScroll = false
                }
                result.push(ctx);
            });
            return result;
        }

        /**
         * @override
         */
        performLayout() {
            var me = this;
            var layoutContext = me.createLayoutContext();
            me.itemsLayoutContext = me.createItemsLayoutContext(layoutContext);
            me.boxProcessor.calculate(me.itemsLayoutContext, layoutContext);
            super.performLayout();
        }

        protected layoutChild(view: Blend.ui.View, index: number) {
            var me = this;
            view.suspendLayout().disableEvents();
            view.setBounds(me.itemsLayoutContext[index]);
            view.resumeLayout().enableEvents();
            view.performLayout();
        }

        /**
         * Create a layout context for this Box layout. We automatically
         * set the box align to stretch if any of the child Views have the
         * split property set to true
         */
        private createLayoutContext(): BoxLayoutContextInterface {
            var me = this, ctx: BoxLayoutContextInterface = {
                align: me.align,
                pack: me.pack,
                margin: me.defaultItemMargin,
                direction: me.direction,
                allowScroll: me.allowScroll,
                bounds: me.bodyElement.getBounds()
            }
            return ctx;
        }
    }

}