/// <reference path="../mvc/View.ts" />
/// <reference path="../dom/Element.ts" />


namespace Blend.ui {

    export class View extends Blend.mvc.View {

        protected parent: Blend.ui.View;
        protected element: Blend.dom.Element;
        protected isRendered: boolean;
        protected visible: boolean;
        protected config: UIViewInterface;
        protected cssClass: Array<string>;
        protected layoutEnabled: boolean;
        protected layoutTriggers: Array<string>
        private sizeHash: string;
        private isInALayoutContext: boolean

        public constructor(config: UIViewInterface = {}) {
            super(config);
            var me = this;
            me.isInALayoutContext = false;
            me.sizeHash = null;
            me.parent = config.parent || null;
            me.isRendered = false;
            me.visible = true;
            me.layoutEnabled = true;
            me.cssClass = [];
            me.config = {
                css: [],
                style: {},
                visible: true,
                top: null,
                left: null,
                width: null,
                height: null
            };
            me.layoutTriggers = [
                'redo-layout',
                'boundsChanged',
                'visibilityChanged'
            ];
            me.setCssClass(config.css || [], true);
            me.setStyle(config.style || {});
            me.setVisible(Blend.isBoolean(config.visible) ? config.visible : true);
            me.setBounds({
                top: config.top || null,
                left: config.left || null,
                width: config.width || null,
                height: config.height || null
            });
        }

        /////////////////////////////////////////////////////////////////////////
        // BOUNDS
        /////////////////////////////////////////////////////////////////////////

        /**
         * Returns the bounds of this View based on the ViewBoundsInterface interface
         */
        getBounds(): ElementBoundsInterface {
            var me = this;
            if (me.isRendered) {
                return me.element.getBounds();
            } else {
                return null;
            }
        }

        /**
         * Sets the bounds of this View based on the ViewBoundsInterface interface
         */
        setBounds(bounds: ElementBoundsInterface) {
            var me = this;
            if (me.isRendered) {
                me.setStyle(<StyleInterface>bounds);
            } else {
                Blend.apply(me.config, bounds);
            }
            me.notifyBoundsChanged();
        }

        /**
         * Sends boundsChanged notification
         */
        notifyBoundsChanged() {
            var me = this;
            if (me.isRendered) {
                me.fireEvent('boundsChanged', me.getBounds());
            }
        }


        /////////////////////////////////////////////////////////////////////////
        // VISIBILITY
        //////////////////////////////////////////////////////////////////////////
        /**
         * Sets the visibility state for this View
         */
        setVisible(visible: boolean = true) {
            var me = this
            me.visible = visible === true ? true : false;
            if (me.isRendered) {
                me.element.setData('visible', me.visible);
            } else {
                me.config.visible = me.visible;
            }
            me.notifyVisibilityChanged();
        }

        /**
         * gets the visibility state of this View
         */
        isVisible() {
            var me = this;
            return me.visible;
        }

        /**
         * Sends a visibilityChanged notification
         */
        protected notifyVisibilityChanged() {
            var me = this;
            me.fireEvent('visibilityChanged', me.visible);
        }
        /////////////////////////////////////////////////////////////////////////

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
            var me = this;
            if (me.canLayout()) {
                me.suspendLayout();
                if (me.shouldLayout()) {
                    me.layoutView.apply(me, arguments);
                }
                me.resumeLayout();
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

        /**
         * Destroys this View by setting the properties to null,
         * deleting them and removing its HTMLElement
         */
        public destroy() {
            var me = this,
                pNode: Node,
                cNode: Node;

            if (me.isRendered) {
                cNode = me.element.getEl();
                pNode = cNode.parentNode || null;
                if (pNode) {
                    pNode.removeChild(cNode);
                }
            }

            Blend.forEach(me, function(value: any, key: string) {
                (<any>me)[key] = null;
                delete ((<any>me)[key]);
            });
        }

        /**
         * Sets the Styles for this View
         * */
        public setStyle(style: StyleInterface) {
            var me = this;
            if (me.isRendered) {
                me.element.setStyle(style);
            } else {
                Blend.apply(me.config.style, style, false, true);
            }
            me.redoLayout();
        }

        /**
         * Adds one or more CSS classes to this View
         */
        public setCssClass(css: string | Array<string>, blendPrefix: boolean = false) {
            var me = this;
            if (me.isRendered) {
                me.element.addCssClass(css, blendPrefix);
            } else {
                Blend.apply(me.config.css, css, false, true);
            }
            me.redoLayout();
        }

        /**
         *Helps configuring the thsi View before the rendering cycle is complete
         */
        protected finalizeRender() {
            var me = this;
            me.setCssClass(me.cssClass, true);
            me.setCssClass(me.config.css, false);
            me.setBounds({
                top: me.config.top,
                left: me.config.left,
                width: me.config.width,
                height: me.config.height
            });
            me.setStyle(me.config.style);
            if (!me.visible) {
                // should be set only when not visible
                me.setVisible(false);
            }
        }

        protected render(): Blend.dom.Element {
            return Blend.dom.Element.create({});
        }

        /**
        * Retrives the HTMLElement for this View
        */
        public getElement(): HTMLElement {
            var me = this;
            if (!me.isRendered) {
                me.dispableEvents();
                me.element = me.render();
                me.isRendered = true
                me.finalizeRender();
                me.enableEvents();
                delete (me.config);
            }
            return me.element.getEl();
        }

        /**
         * Internal notification to initiate a layout cycle. This method
         * is used when the View has to relayout but no external event
         * should be fired
         */
        protected redoLayout() {
            this.fireEvent('redo-layoyt');
        }

        protected fireEvent(eventName: string, ...args: any[]) {
            /**
             * Override of the fireEvent function to trigger
             * performLayout on registered events.
             */
            var me = this;
            if (me.isRendered === true && me.eventsEnabled === true) {
                me.handleLayoutTriggers(eventName);
                if (eventName !== 'redo-layout') {
                    super.fireEvent.apply(me, arguments);
                }
            }
        }
    }
}