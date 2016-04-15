/// <reference path="Layoutable.ts" />
/// <reference path="../dom/Element.ts" />


namespace Blend.ui {

    /**
     * Common baseclass for a UI View component
     */
    export class View extends Blend.ui.Layoutable {

        protected isInitialized: boolean;

        public constructor(config: UIViewInterface = {}) {
            super(config);
            var me = this;
            me.isInitialized = false;
        }

        protected initialize() {

        }

        public performLayout() {
            var me = this;
            if (me.isInitialized === false) {
                var curLayoutState = me.layoutEnabled;
                me.suspendLayout();
                me.initialize();
                me.isInitialized = true;
                me.layoutEnabled = curLayoutState;
                delete (me.config);
            }
            super.performLayout();
        }
    }
}