/// <reference path="ViewBase.ts" />
/// <reference path="../dom/Element.ts" />


namespace Blend.ui {

    /**
     * Base class for an MVC View that capricipate in a layout cycle
     */
    export abstract class Layoutable extends Blend.ui.ViewBase {

        protected layoutEnabled: boolean;
        protected layoutTriggers: Array<string>
        private isInALayoutContext: boolean
        private sizeHash: string;

        public constructor(config: UIViewInterface = {}) {
            super(config);
            var me = this;
            me.layoutEnabled = true;
            me.sizeHash = null;
            me.layoutTriggers = [];
            me.addLayoutTriggerEvent([
                'styleChanged',
                'boundsChanged',
                'visibilityChanged'
            ]);
        }

        public addLayoutTriggerEvent(eventName: string | Array<string>): Blend.ui.Layoutable {
            var me = this;
            Blend.wrapInArray(eventName).forEach(function(evt: string) {
                me.layoutTriggers.push(evt);
            });
            return this;
        }

        /**
         * Makes sure the layout state is invalid so it can be placed in
         * the next layout cycle
         */
        public invalidateLayout(performLayout?: boolean): Blend.ui.Layoutable {
            var me = this;
            me.sizeHash = null;
            if (performLayout === true) {
                me.performLayout();
            }
            return this;
        }

        /**
         * Initiates a layout cycle based on an event. This function also checks
         * whether the view is currently part of an existing layout cycle.
         * If the component is part on a layout cycle then its native performLayout is
         * called, otherwise if it has a parent then the layout cycle will be deligated
         * from there.
         */
        private handleLayoutTriggers() {
            var me = this;
            // only fire the event when the component is rendered and ready
            if (me.layoutTriggers.indexOf(me.currentEventName) !== -1) {
                if (me.parent && (<Blend.ui.Layoutable>me.parent).canLayout()) {
                    (<View>me.parent).invalidateLayout(true);
                } else {
                    me.performLayout();
                }
            }
        }

        /**
         * Creates and retrives the current size hash on this View
         */
        protected getSizeHash(): string {
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
         * Initiates a layout cycle on this View
         */
        public performLayout() {
            var me = this,
                cycled = false;
            if (me.canLayout()) {
                me.suspendLayout();
                if (me.shouldLayout()) {
                    me.layoutView.apply(me, arguments);
                    me.sizeHash = me.getSizeHash();
                    cycled = true;
                }
                me.resumeLayout();
                if (cycled && Blend.DEBUG === true) {
                    me.fireEvent('layoutCycleFinished');
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
        public canLayout() {
            var me = this;
            return (me.layoutEnabled === true
                && me.isRendered === true
                && me.visible === true);
        }

        /**
         * Temporary suspends the layout cycle
         */
        public suspendLayout(): Blend.ui.Layoutable {
            this.layoutEnabled = false;
            return this;
        }

        /**
         * Resumes the layout cycle
         */
        public resumeLayout(): Blend.ui.Layoutable {
            this.layoutEnabled = true;
            return this;
        }

        public canFireEvents(): boolean {
            var me = this, state = super.canFireEvents();
            if (state === true) {
                me.handleLayoutTriggers();
            }
            return state;
        }
    }
}