/// <reference path="../mvc/View.ts" />
/// <reference path="../dom/Element.ts" />


namespace Blend.ui {

    export class ViewBase extends Blend.mvc.View {

        protected parent: Blend.ui.View;
        protected element: Blend.dom.Element;
        protected isRendered: boolean;
        protected visible: boolean;
        protected config: UIViewInterface;
        protected cssClass: Array<string>;

        public constructor(config: UIViewInterface = {}) {
            super(config);
            var me = this;
            me.parent = config.parent || null;
            me.isRendered = false;
            me.visible = true;
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
        // STYLE and CSS
        //////////////////////////////////////////////////////////////////////////

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
            me.notifyStyleOrCSSChanged();
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
            me.notifyStyleOrCSSChanged();
        }

        /**
         * Sends a visibilityChanged notification
         */
        protected notifyStyleOrCSSChanged() {
            var me = this;
            me.fireEvent('styleChanged', me.visible);
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

    }
}