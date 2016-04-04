/// <reference path="../common/Interfaces.ts" />

namespace Blend.dom {

    /**
     * Wraps an HTMLElement into a utility class for easier  manipulation
     * and hadling
     */
    export class Element {

        private el: HTMLElement;

        constructor(el: HTMLElement) {
            this.el = el;
        }

        /**
         * Sets the styles for this element;
         */
        public setStyles(style: StyleInterface): Blend.dom.Element {
            return this;
        }

        /**
         * Toggles the css classes for this element
         */
        public setCssClass(cssClasses: CssClassInterface): Blend.dom.Element {
            return this;
        }

        /**
         * Sets the data-* attribute for this element
         */
        public setData(name: string, value: any): Blend.dom.Element {
            this.el.setAttribute('data-' + name, value);
            return this;
        }
        
        /**
         * Gets a data attribute or returns a default value if the attribute does
         * not exist
         */
        public getData(name:string, defaultValue:any = null) : any {
            var me = this,
                attr:string = 'data-' + name;
            return me.el.hasAttribute(attr) ? me.el.getAttribute(attr) : defaultValue;
        }

    }

}