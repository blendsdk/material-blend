/// <reference path="../mvc/View.ts" />
/// <reference path="../dom/Element.ts" />


namespace Blend.ui {

    export class View extends Blend.mvc.View {

        protected element: Blend.dom.Element;
        protected isRendered: boolean;
        protected config: UIViewInterface;
        protected cssClass: string;


        public constructor(config: UIViewInterface = {}) {
            super(config);
            var me = this;
            me.isRendered = false;
            me.cssClass = null;
            me.config = {};
            me.config.css = Blend.wrapInArray<string>(config.css || []);
        }

        /**
         *Helps configuring the thsi View before the rendering cycle is complete
         */
        protected finalizeRender() {
            var me = this;
            me.element.addCssClass([me.cssClass].concat(<Array<string>>me.config.css));
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
                me.finalizeRender();
                me.enableEvents();
                me.isRendered = true;
                delete (me.config);
            }
            return me.element.getEl();
        }
    }

}