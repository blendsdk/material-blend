/// <reference path="../mvc/View.ts" />
/// <reference path="../dom/Element.ts" />


namespace Blend.ui {

    export class View extends Blend.mvc.View {

        protected element: Blend.dom.Element;
        protected isRendered: boolean;
        protected config: UIViewInterface;
        protected cssClass: Array<string>;

        public constructor(config: UIViewInterface = {}) {
            super(config);
            var me = this;
            me.isRendered = false;
            me.cssClass = [];
            me.config = {
                css: [],
                style: {}
            };
            me.setCssClass(config.css || [], true);
            me.setStyle(config.style || {});
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
        }

        /**
         *Helps configuring the thsi View before the rendering cycle is complete
         */
        protected finalizeRender() {
            var me = this;
            me.setCssClass(me.cssClass, true);
            me.setCssClass(me.config.css, false);
            me.setStyle(me.config.style);
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
    }

}