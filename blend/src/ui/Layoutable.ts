/// <reference path="ViewBase.ts" />
/// <reference path="../dom/Element.ts" />


namespace Blend.ui {

    /**
     * Base class for an MVC View that capricipate in a layout cycle
     */
    export class Layoutable extends Blend.ui.ViewBase {

        protected layoutEnabled: boolean;
        protected layoutTriggers: Array<string>
        private isInALayoutContext: boolean
        private sizeHash: string;

        public constructor(config: UIViewInterface = {}) {
            super(config);
            var me = this;
            me.isInALayoutContext = false;
            me.layoutEnabled = true;
            me.sizeHash = null;
            me.layoutTriggers = [
                'styleChanged',
                'boundsChanged',
                'visibilityChanged'
            ];
        }

        /**
         * Makes sure the layout state is invalid so it can be placed in
         * the next layout cycle
         */
        invalidateLayout(performLayout?: boolean) {
            var me = this;
            me.sizeHash = null;
            if (performLayout === true) {
                me.performLayout();
            }
        }

        /**
         * Initiates a layout cycle based on an event. This function also checks
         * whether the view is currently part of an existing layout cycle.
         * If the component is part on a layout cycle then its native performLayout is
         * called, otherwise if it has a parent then the layout cycle will be deligated
         * from there.
         */
        private handleLayoutTriggers(eventName: string) {
            var me = this;
            // only fire and event when the component is rendered and ready
            if (me.layoutTriggers.indexOf(eventName) !== -1 && me.canLayout()) {
                if (!me.isInALayoutContext && me.parent) {
                    (<View>me.parent).invalidateLayout(true);
                } else {
                    me.performLayout();
                }
            }
        }

        /**
         * Creates and retrives the current size hash on this View
         */
        private getSizeHash(): string {
            var me = this,
                cs = <ElementBoundsInterface>me.getBounds();
            return [cs.height, cs.width].join('-');
        }

        /**
         * Performs the actual layout peration on thie View
         */
        protected layoutView() {

        }

        /**
         * Put this View in a parent layout context by passing true
         * or false otherwise
         */
        placeInALayoutContext(state: boolean) {
            this.isInALayoutContext = state;
        }

        /**
         * Initiates a layout cycle on this View
         */
        public performLayout() {
            var me = this,
                cycled = false;;
            if (me.canLayout()) {
                me.suspendLayout();
                me.dispableEvents();
                if (me.shouldLayout()) {
                    me.layoutView.apply(me, arguments);
                    me.sizeHash = me.getSizeHash();
                    cycled = true;
                }
                me.resumeLayout();
                me.enableEvents();
                if (cycled) {
                    me.fireEvent('layoutCycleFinished')
                }
            }

        }

        /**
         * Checks if the size of this View is different that sizeHash.
         * If so then this View should be placed in a layout cycle
         */
        protected shouldLayout(): boolean {
            var me = this, cur = me.getSizeHash();
            return (me.sizeHash !== cur);
        }

        /**
         * Checks if this View can be placed in a layout cycle
         */
        protected canLayout() {
            return this.layoutEnabled
                && this.isRendered
                && this.visible;
        }

        /**
         * Temporary suspends the layout cycle
         */
        public suspendLayout() {
            this.layoutEnabled = false;
        }

        /**
         * Resumes the layout cycle
         */
        public resumeLayout() {
            this.layoutEnabled = true;
        }

        protected fireEvent(eventName: string, ...args: any[]) {
            /**
             * Override of the fireEvent function to trigger
             * performLayout on registered events.
             */
            var me = this;
            if (me.isRendered === true && me.eventsEnabled === true) {
                me.handleLayoutTriggers(eventName);
                super.fireEvent.apply(me, arguments);
            }
        }
    }
}