/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../ui/ContainerViewBase.ts" />

namespace Blend.container {

    export class Fit extends Blend.ui.ContainerViewBase {

        protected config: FitContainerInterface;
        protected fittedView: Blend.ui.ViewBase;

        public constructor(config: FitContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = 'fit-container';
            me.itemCSSClass = cssPrefix(me.cssClass + '-item');
            me.fittedView = null;
            me.setContentPadding(config.contentPadding || 0);
            me.layoutTriggers.push('contentPaddingChanged');
        }

        protected layoutView() {
            var me = this;
            if (me.fittedView) {
                // first time cleanup
                me.fittedView.setBounds({ top: null, left: null, width: null, height: null });
                me.fittedView.setStyle({ display: null });
            }
            me.performLayoutChildren();
        }

        public setContentPadding(value: number | UIPaddingInterface) {
            var me = this;
            if (me.isRendered) {
                me.getElement().setPadding(value);
            } else {
                me.config.contentPadding = value;
            }
            me.notifyContentPaddingChanged(value);
        }

        /**
         * Creates and retrives the current size hash on this View
         */
        protected getSizeHash(): string {
            var me = this,
                bs = me.bodyElement.getBounds();
            return super.getSizeHash() + ([bs.width, bs.height].join('-'));
        }

        /**
         * Sends a visibilityChanged notification
         */
        protected notifyContentPaddingChanged(value: number | UIPaddingInterface) {
            var me = this;
            me.fireEvent('contentPaddingChanged', value);
        }

        protected finalizeRender() {
            var me = this;
            super.finalizeRender.apply(me, arguments);
            me.setContentPadding(me.config.contentPadding);
        }

        protected render(): Blend.dom.Element {
            var me = this;
            return Blend.dom.Element.create({
                children: [me.renderBodyElement()]
            });
        }

        public addView(item: UIType | Array<UIType>) {
            var me = this;
            if (me.items.length === 0) {
                super.addView.apply(me, arguments);
                me.fittedView = me.items[0];
            } else {
                throw new Error('Fit container can only have one child view!');
            }
        }
    }

}