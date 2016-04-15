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

        public suspendLayout(): Blend.ui.Layoutable {
            /**
             * We use this function as a hook from inside the performLayout
             * to to able to call the initialize() method once in the lifetime
             * of a View
             */
            var me = this;
            super.suspendLayout();
            if (me.isInitialized === false) {
                me.disableEvents();
                me.initialize();
                me.isInitialized = true;
                delete (me.config);
                me.enableEvents();
                me.notifyViewInitialized();
            }
            return this;
        }

        public canFireEvents(): boolean {
            var me = this, state = super.canFireEvents();
            if (state === false && me.currentEventName === 'viewInitialized') {
                return true;
            } else {
                return state;
            }
        }

        /**
         * Sends a viewInitialized notification
         */
        protected notifyViewInitialized() {
            var me = this
            me.fireEvent('viewInitialized', me);
        }
    }
}