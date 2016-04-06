/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />

namespace Blend.dom {

    /**
     * Wraps an HTMLElement into a utility class for easier  manipulation
     * and hadling
     */
    export class Element {

        /**
         * CSS Prefix value made available from code
         */
        public CSS_PREFIX = 'b-';
        private el: HTMLElement;
        private pixelRe = /px$/;
        private UNIT: string = 'px';
        private unitPropertyRe: RegExp = /(width$|height$|size$|radius$|padding|margin$|top$|bottom$|right$|left$)/;
        private unitTypeRe: RegExp = /(em$|\%$|auto|^calc)/;

        constructor(el: HTMLElement) {
            this.el = el;
        }

        /**
         * Sets the style of this element
         */
        public setStyle(styles: StyleInterface): Blend.dom.Element {
            var me = this;
            if (styles) {
                Blend.forEach(styles, function(v: any, k: string) {
                    if (v === null || (<string>v) === 'auto') {
                        me.el.style.removeProperty(k);
                    } else {
                        me.el.style.setProperty(k, me.toUnit(k, v));
                    }
                });
            }
            return this;
        }

        /**
         * Gets the computed styles of en element
         */
        public getStyle(styles: string | Array<string>): StyleInterface {
            var me = this,
                cs = window.getComputedStyle(me.el, null),
                r: StyleInterface = {},
                names = Blend.wrapInArray<string>(styles);
            Blend.forEach(names, function(key: string) {
                r[key] = me.fromUnit(cs.getPropertyValue(key));
            });
            return r;
        }

        /**
         * Checks and converts the value to px based on the given key
         */
        private toUnit(key: string, value: any) {
            var me = this;
            if (value !== null && me.unitPropertyRe.test(key) && !me.unitTypeRe.test(value)) {
                value = value + me.UNIT;
            }
            return value;
        }


        /**
         * Given the value it converts px value to a number, otherwise it returns the original
         * value.
         */
        private fromUnit(value: any): any {
            var me = this;
            if (value !== null && me.pixelRe.test(value)) {
                value = parseFloat(value.replace(me.UNIT, ''));
            }
            return value;
        }

        /**
         * Gets the CSS classes from this element if possible
         * @return string|string[]
         */
        public getCssClass(asArray: boolean = false): (string | Array<string>) {
            var css = (this.el.getAttribute('class') || '').trim();
            if (asArray === true) {
                return css === "" ? [] : css.split(' ')
            } else {
                return css;
            }
        }

        /**
         * Checks whether this element has a given CSS class
         */
        public hasCssClass(name: string, checkPrefixed: boolean = true): boolean {
            var me = this,
                check = checkPrefixed === true ? me.CSS_PREFIX + name : name;
            return (this.el.getAttribute('class') || '').trim().indexOf(check, 0) !== -1;
        }

        /**
         * Adds a new css class with prefix to an element if it already does not exist
         * The prefix flag (defaults to true) will automatically add the CSS_PREFIX to each class
         * The replace flag will replace the existsing css class value
         */
        public addCssClass(css: string | string[], prefix: boolean = true, replace: boolean = false): Blend.dom.Element {
            var me = this,
                r = Blend.wrapInArray<string>(css),
                cur = replace === true ? [] : <Array<string>>me.getCssClass(true);
            if (prefix === true) {
                r = r.map(function(itm: string) {
                    return me.CSS_PREFIX + itm;
                });
            }
            me.el.setAttribute('class', cur.concat(r).unique().join(' '));
            return this;
        }

        /**
         * Clears the value of the class attribute of this element
         */
        public clearCssClass(): Blend.dom.Element {
            this.el.setAttribute('class', '');
            return this;
        }

        /**
         * Sets the styles for this element;
         */
        public setStyles(style: StyleInterface): Blend.dom.Element {
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
        public getData(name: string, defaultValue: any = null): any {
            var me = this,
                attr: string = 'data-' + name;
            return me.el.hasAttribute(attr) ? me.el.getAttribute(attr) : defaultValue;
        }

        /**
         * Enables/Disables the text select state of this element
         */
        public selectable(state: boolean) {
            this.setData('selectable', state === true ? 'on' : 'off');
        }

        /**
         * Gets the native HTMLElement
         */
        public getEl(): HTMLElement {
            return this.el;
        }

        /**
         * Created an Element based on CreateElementInterface
         */
        public static create(config: CreateElementInterface, elCallback?: Function, elCallbackScope?: any): Blend.dom.Element {
            var me = this;
            if (Blend.isObject(config)) {
                var el: HTMLElement = document.createElement(config.tag || 'div');
                for (var cfg in config) {
                    var val: any = (<any>config)[cfg];
                    if (cfg !== 'tag' && cfg !== 'scope' && cfg !== 'oid') {
                        if (cfg === 'cls') {
                            cfg = 'class';
                            if (Blend.isArray(val)) {
                                val = <Array<string>>val.join(' ');
                            }
                        } else if (cfg === 'innerHTML') {
                            cfg = null;
                            el.innerHTML = val;
                        } else if (cfg === 'text') {
                            cfg = null;
                            var textNd = document.createTextNode(val);
                            el.appendChild(textNd);
                        } else if (cfg === 'listeners' && Blend.isObject(val)) {
                            cfg = null;
                            for (var e in val) {
                                var handler = val[e];
                                Blend.Runtime.addEventListener(el, e, function() {
                                    handler.apply(config.scope || window, arguments);
                                });
                            }
                        } else if (cfg === 'children') {
                            if (!Blend.isArray(val)) {
                                val = [val];
                            }
                            val.forEach(function(child: HTMLElement | CreateElementInterface | Blend.dom.Element) {
                                if (child instanceof HTMLElement) {
                                    el.appendChild(<HTMLElement>child);
                                } else if (child instanceof Blend.dom.Element) {
                                    el.appendChild((<Blend.dom.Element>child).getEl());
                                } else {
                                    el.appendChild(Blend.dom.Element.create(<CreateElementInterface>child, elCallback, elCallbackScope).getEl());
                                }
                            });
                            cfg = null;
                        } else if (cfg === 'data') {
                            Blend.forEach(val, function(v: any, k: string) {
                                el.setAttribute('data-' + k, v);
                            });
                            cfg = null;
                        } else if (cfg === 'style') {
                            cfg = null;
                            wrapEl(el).setStyle(<StyleInterface>val);
                        } else if (cfg == 'selectable') {
                            if (val === false) {
                                wrapEl(el).selectable(false);
                            }
                            cfg = null;
                        }
                        if (cfg) {
                            el.setAttribute(cfg, val);
                        }
                    }
                }
                if (elCallback && config.oid) {
                    elCallback.apply(elCallbackScope || window, [el, config.oid]);
                }
                return new Blend.dom.Element(el);
            } else {
                return null;
            }
        }
    }
}

/**
 * Shorthand function to wrap a HTMLElement into a Blend.dom.Element
 */
var wrapEl = function(el: HTMLElement) {
    return new Blend.dom.Element(el);
}

var createEl = Blend.dom.Element.create;