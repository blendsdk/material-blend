/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../ui/ContainerView.ts" />

namespace Blend.ui {

    /**
     * Base class for a container that can provide content padding
     */
    export abstract class PaddableContainer extends Blend.ui.ContainerView {

        protected config: PaddableContainerInterface;

        public constructor(config: PaddableContainerInterface = {}) {
            super(config);
            var me = this;
            me.setContentPadding(config.contentPadding || 0);
            me.layoutTriggers.push('contentPaddingChanged');
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

    }
}
