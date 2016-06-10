var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
if (!XMLHttpRequest.prototype.sendAsBinary) {
    /**
     * From MDN
     */
    XMLHttpRequest.prototype.sendAsBinary = function (sData) {
        var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
        for (var nIdx = 0; nIdx < nBytes; nIdx++) {
            ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
        }
        this.send(ui8Data);
    };
}
if (!Function.prototype.async) {
    Function.prototype.async = function () {
        var me = this, args = arguments;
        setTimeout(function () {
            me.apply(me, args);
        }, 1);
    };
}
if (!String.prototype.inArray) {
    String.prototype.inArray = function (list) {
        if (list === void 0) { list = []; }
        var result = false;
        for (var i = 0; i !== list.length; i++) {
            if (list[i] === this) {
                result = true;
                break;
            }
        }
        return result;
    };
}
if (!String.prototype.repeat) {
    String.prototype.repeat = function (counts) {
        return new Array(counts + 1).join(this);
    };
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        if (position === void 0) { position = 0; }
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}
if (!String.prototype.ucfirst) {
    String.prototype.ucfirst = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}
if (!Array.prototype.unique) {
    Array.prototype.unique = function () {
        return this.filter(function (item, i, allItems) {
            return i === allItems.indexOf(item);
        });
    };
}
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Typings.ts" />
var Blend;
(function (Blend) {
    var binding;
    (function (binding) {
        /**
         * Provides signal/slot style object binding.
         * The mapping can be one of the following styles
         */
        var BindingProvider = (function () {
            function BindingProvider() {
            }
            /**
             * Binds the propertys of two components using setSource/getSource/setTarget method
             */
            BindingProvider.prototype.bindProperty = function (source, target, srcProp, trgProp) {
                if (trgProp === void 0) { trgProp = null; }
                trgProp = trgProp || srcProp;
                this.bind(source, target, "set" + srcProp.ucfirst(), "set" + trgProp.ucfirst(), "get" + srcProp.ucfirst());
            };
            BindingProvider.prototype.bind = function (source, target, sourceMember, targetMember, usingMember) {
                var orgSourceMember = source[sourceMember];
                source[sourceMember] = function () {
                    var sr = orgSourceMember.apply(source, arguments);
                    target.applyFunction(targetMember, [usingMember !== null ? source.applyFunction(usingMember, [sr]) : sr]);
                    return sr;
                };
            };
            return BindingProvider;
        }());
        binding.BindingProvider = BindingProvider;
    })(binding = Blend.binding || (Blend.binding = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="Typings.ts" />
/// <reference path="Blend.ts" />
/// <reference path="binding/BindingProvider.ts" />
var Blend;
(function (Blend) {
    /**
     * Base class for a component in Blend
     */
    var Component = (function () {
        function Component(config) {
            if (config === void 0) { config = null; }
            var me = this;
        }
        /**
         * Get the value of a perperty of this component. This is used to
         * Read the private-ish value of a component
          */
        Component.prototype.getProperty = function (name, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            var me = this;
            return (me[name] === undefined ? defaultValue : me[name]);
        };
        /**
         * Provides a way to externally set a property on this component
         */
        Component.prototype.setProperty = function (name, value) {
            var me = this;
            me[name] = value;
        };
        /**
         * Check if this Component implements a function
         */
        Component.prototype.hasFunction = function (fname) {
            var me = this;
            return !Blend.isNullOrUndef(me[fname]) && Blend.isFunction(me[fname]);
        };
        /**
         * Dynamically run a function within this Component
         */
        Component.prototype.applyFunction = function (name, args) {
            var me = this, fn = me[name];
            if (Blend.isFunction(fn)) {
                return fn.apply(me, args);
            }
            else {
                throw new Error("Class method [" + name + "] does not exist!");
            }
        };
        return Component;
    }());
    Blend.Component = Component;
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Blend;
(function (Blend) {
    var dom;
    (function (dom) {
        /**
         * Implements a classList provider for the Blend.dom.Element
         */
        var ClassList = (function () {
            function ClassList(htmlElement) {
                var me = this;
                me.list = [];
                me.initList((htmlElement.getAttribute("class") || "").trim());
            }
            ClassList.prototype.initList = function (css) {
                var me = this;
                (css === "" ? [] : css.split(" ")).forEach(function (c) {
                    c = c.trim();
                    if (c.length !== 0 && c !== "") {
                        me.list.push(c);
                    }
                });
            };
            ClassList.prototype.serializeTo = function (htmlElement) {
                var me = this, css = me.toString();
                if (css !== null && css !== "" && css.length !== 0) {
                    htmlElement.setAttribute("class", css);
                }
                else {
                    htmlElement.removeAttribute("class");
                }
            };
            ClassList.prototype.removeLike = function (list) {
                var me = this, i = -1, n = [];
                list.forEach(function (r) {
                    me.list.forEach(function (i) {
                        if (!i.startsWith(r)) {
                            n.push(i);
                        }
                    });
                });
                me.list = n;
            };
            ClassList.prototype.remove = function (list) {
                var me = this, i = -1;
                list.forEach(function (r) {
                    i = me.list.indexOf(r);
                    if (i !== -1) {
                        me.list.splice(i, 1);
                    }
                });
            };
            ClassList.prototype.add = function (list) {
                var me = this;
                list.forEach(function (i) {
                    if (!me.has(i)) {
                        me.list.push(i);
                    }
                });
            };
            ClassList.prototype.clear = function () {
                this.list = [];
            };
            ClassList.prototype.has = function (n) {
                return this.list.indexOf(n) !== -1;
            };
            ClassList.prototype.toString = function () {
                var r = this.list.join(" ").trim();
                return r === "" ? null : r;
            };
            ClassList.prototype.toArray = function () {
                return this.list;
            };
            return ClassList;
        }());
        dom.ClassList = ClassList;
    })(dom = Blend.dom || (Blend.dom = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Blend;
(function (Blend) {
    var dom;
    (function (dom) {
        /**
         * Implements a style list provides for the Blend.dom.Element
         */
        var StyleList = (function () {
            function StyleList(el) {
                this.pixelRe = /px$/;
                this.UNIT = "px";
                this.unitPropertyRe = /(width$|height$|size$|radius$|padding|margin$|top$|bottom$|right$|left$)/;
                this.unitTypeRe = /(em$|\%$|auto|^calc)/;
                this.initList(el.style.cssText.trim());
            }
            StyleList.prototype.initList = function (data) {
                var me = this, p;
                me.styles = {};
                if (data !== "") {
                    data.split(";").forEach(function (d) {
                        if (d !== "") {
                            p = d.split(":");
                            me.styles[p[0].trim()] = me.fromUnit(p[1].trim());
                        }
                    });
                }
            };
            StyleList.prototype.set = function (name, value) {
                this.styles[name] = value;
            };
            StyleList.prototype.unset = function (name) {
                delete (this.styles[name]);
            };
            StyleList.prototype.getComputed = function (el, names) {
                var me = this, cs = window.getComputedStyle(el, null), r = {};
                names.forEach(function (key) {
                    r[key] = me.fromUnit(cs.getPropertyValue(key));
                });
                return r;
            };
            StyleList.prototype.serializeTo = function (el) {
                var me = this, style = "";
                Object.keys(me.styles).forEach(function (name) {
                    style += name + ":" + me.toUnit(name, me.styles[name]) + ";";
                });
                if (style !== "") {
                    el.style.cssText = style;
                }
            };
            /**
             * Checks and converts the value to px based on the given key
             */
            StyleList.prototype.toUnit = function (key, value) {
                var me = this;
                if (value !== null && me.unitPropertyRe.test(key) && !me.unitTypeRe.test(value)) {
                    value = value + me.UNIT;
                }
                return value;
            };
            /**
             * Given the value it converts px value to a number, otherwise it returns the original
             * value.
             */
            StyleList.prototype.fromUnit = function (value) {
                var me = this;
                if (value !== null && me.pixelRe.test(value)) {
                    value = parseFloat(value.replace(me.UNIT, ""));
                }
                return value;
            };
            return StyleList;
        }());
        dom.StyleList = StyleList;
    })(dom = Blend.dom || (Blend.dom = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Typings.ts" />
/// <reference path="../Component.ts" />
/// <reference path="ClassList.ts" />
/// <reference path="StyleList.ts" />
/// <reference path="../Blend.ts" />
var Blend;
(function (Blend) {
    var dom;
    (function (dom) {
        /**
         * Wraps an HTMLElement into a utility class for easier  manipulation
         * and hadling
         */
        var Element = (function (_super) {
            __extends(Element, _super);
            function Element(el) {
                _super.call(this);
                this.pixelRe = /px$/;
                this.UNIT = "px";
                this.unitPropertyRe = /(width$|height$|size$|radius$|padding|margin$|top$|bottom$|right$|left$)/;
                this.unitTypeRe = /(em$|\%$|auto|^calc)/;
                this.el = el;
                this.classList = new Blend.dom.ClassList(this.el);
                this.styleList = new Blend.dom.StyleList(this.el);
            }
            /**
             * Sets an attribute to this element
             */
            Element.prototype.setAttribute = function (name, value) {
                var me = this;
                me.el.setAttribute.apply(me.el, arguments);
                return me;
            };
            /**
             * Removed an attribute from this element
             */
            Element.prototype.removeAttribute = function (name) {
                var me = this;
                me.el.removeAttribute(name);
                return me;
            };
            /**
             * Get the list of files for from this Element
              */
            Element.prototype.getFiles = function () {
                var me = this, fel = me.el;
                if (fel.files) {
                    return fel.files;
                }
                else {
                    return new FileList(); // return an empty one
                }
            };
            /**
             * Adds an EventListener to an EventTarget
             */
            Element.prototype.addEventListener = function (eventName, eventHandler) {
                Blend.Runtime.addEventListener(this.el, eventName, eventHandler);
            };
            /**
             * Removes an EventListener from an EventTarget
             */
            Element.prototype.removeEventListener = function (eventName, eventHandler) {
                Blend.Runtime.removeEventListener(this.el, eventName, eventHandler);
            };
            /**
             * Retuns the computed bounds
             */
            Element.prototype.getBounds = function () {
                var bounds = this.getStyle(["top", "left", "width", "height", "visible"]), borderSize;
                if (Blend.Runtime.IE && Blend.Runtime.IEVersion < 12) {
                    borderSize = this.getStyle(["border-top-width", "border-right-width", "border-bottom-width", "border-left-width"]);
                    bounds.width += borderSize["border-left-width"] + borderSize["border-right-width"];
                    bounds.height += borderSize["border-top-width"] + borderSize["border-bottom-width"];
                    return bounds;
                }
                else {
                    return bounds;
                }
            };
            /**
             * Sets the style of this element
             */
            Element.prototype.setStyle = function (styles) {
                var me = this;
                if (styles) {
                    Blend.forEach(styles, function (v, k) {
                        if (v === null || v === "auto") {
                            me.styleList.unset(k);
                        }
                        else {
                            me.styleList.set(k, v);
                        }
                    });
                    me.styleList.serializeTo(me.el);
                }
                return this;
            };
            /**
             * Gets the computed styles of en element
             */
            Element.prototype.getStyle = function (styles) {
                return this.styleList.getComputed(this.el, Blend.wrapInArray(styles));
            };
            /**
             * Gets the CSS classes from this element if possible
             * @return string|string[]
             */
            Element.prototype.getCssClass = function (asArray) {
                if (asArray === void 0) { asArray = false; }
                return asArray === true ? this.classList.toArray() : this.classList.toString();
            };
            /**
             * Checks whether this element has a given CSS class
             */
            Element.prototype.hasCssClass = function (name) {
                return this.classList.has(name);
            };
            /**
             * Adds a new css class an element if it already does not exist
             * The replace flag will replace the existsing css class value
             */
            Element.prototype.addCssClass = function (css, replace) {
                if (replace === void 0) { replace = false; }
                var me = this, t = [];
                if (replace === true) {
                    this.classList.clear();
                }
                me.classList.add(Blend.wrapInArray(css));
                me.classList.serializeTo(me.el);
                return this;
            };
            /**
             * Removes one of more CSS classes from this element
             */
            Element.prototype.removeCssClass = function (css) {
                var me = this, t = [];
                me.classList.remove(Blend.wrapInArray(css));
                me.classList.serializeTo(me.el);
                return this;
            };
            /**
             * Removes one or more CSS classes from this element by checking if the
             * CSS names start with the given request
             */
            Element.prototype.removeCssClassLike = function (css) {
                var me = this, t = [];
                me.classList.removeLike(Blend.wrapInArray(css));
                me.classList.serializeTo(me.el);
                return this;
            };
            /**
             * Clears the value of the class attribute of this element
             */
            Element.prototype.clearCssClass = function () {
                this.classList.clear();
                return this;
            };
            /**
             * Removes the child elements from this Element
             */
            Element.prototype.clearElement = function () {
                var me = this;
                if (me.el) {
                    while (me.el.firstChild) {
                        me.el.removeChild(me.el.firstChild);
                    }
                }
            };
            /**
             * Sets the data-* attribute for this element
             */
            Element.prototype.setData = function (name, value) {
                this.el.setAttribute("data-" + name, value);
                return this;
            };
            /**
             * Gets a data attribute or returns a default value if the attribute does
             * not exist
             */
            Element.prototype.getData = function (name, defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                var me = this, attr = "data-" + name;
                return me.el.hasAttribute(attr) ? me.el.getAttribute(attr) : defaultValue;
            };
            /**
             * Set the Scroll state for this Element
             */
            Element.prototype.scrollState = function (state) {
                var me = this;
                me.setData("scroll", Blend.eScrollState[state]);
                return this;
            };
            /**
             * Enables/Disables the text select state of this element
             */
            Element.prototype.selectable = function (state) {
                this.setData("selectable", state === true ? "on" : "off");
            };
            /**
             * Gets the native HTMLElement
             */
            Element.prototype.getEl = function () {
                return this.el;
            };
            /**
             * Appends a child Element to this Element
             */
            Element.prototype.append = function (child) {
                this.el.appendChild((child.getEl()));
                return child;
            };
            /**
             * Removes this element from its parent
             */
            Element.prototype.remove = function () {
                var me = this, pNode, cNode;
                cNode = me.el;
                pNode = cNode.parentNode || null;
                if (pNode) {
                    pNode.removeChild(cNode);
                }
            };
            /**
             * Sets the inner HTML of this element
             */
            Element.prototype.setHtml = function (html) {
                this.el.innerHTML = html;
                return this;
            };
            Element.prototype.setPadding = function (value) {
                var me = this, padding = {};
                if (Blend.isNumeric(value)) {
                    me.setStyle({ padding: value });
                }
                else {
                    me.setStyle({
                        "padding-top": value.top || null,
                        "padding-right": value.right || null,
                        "padding-bottom": value.bottom || null,
                        "padding-left": value.left || null
                    });
                }
                return this;
            };
            /**
             * Gets the inner HTML of this element
             */
            Element.prototype.getHtml = function () {
                return this.el.innerHTML;
            };
            /**
             * Created an Element based on CreateElementInterface
             */
            Element.create = function (conf, elCallback, elCallbackScope) {
                var me = this, config;
                if (Blend.isInstanceOf(conf, Blend.dom.ElementConfigBuilder)) {
                    config = conf.getConfig();
                }
                else {
                    config = conf;
                }
                if (Blend.isObject(config)) {
                    var el = document.createElement(config.tag || "div");
                    for (var cfg in config) {
                        var val = config[cfg];
                        if (cfg !== "tag" && cfg !== "scope" && cfg !== "oid") {
                            if (cfg === "cls") {
                                cfg = "class";
                                if (Blend.isArray(val)) {
                                    val = val.join(" ");
                                }
                            }
                            else if (cfg === "innerHTML") {
                                cfg = null;
                                el.innerHTML = val;
                            }
                            else if (cfg === "text") {
                                cfg = null;
                                var textNd = document.createTextNode(val);
                                el.appendChild(textNd);
                            }
                            else if (cfg === "listeners" && Blend.isObject(val)) {
                                cfg = null;
                                for (var e in val) {
                                    var handler = val[e];
                                    Blend.Runtime.addEventListener(el, e, function () {
                                        handler.apply(config.scope || window, arguments);
                                    });
                                }
                            }
                            else if (cfg === "children") {
                                if (!Blend.isArray(val)) {
                                    val = [val];
                                }
                                val.forEach(function (child) {
                                    if (child instanceof HTMLElement) {
                                        el.appendChild(child);
                                    }
                                    else if (child instanceof Blend.dom.Element) {
                                        el.appendChild(child.getEl());
                                    }
                                    else if (child instanceof Blend.dom.ElementConfigBuilder) {
                                        el.appendChild(Blend.dom.Element.create(child, elCallback, elCallbackScope).getEl());
                                    }
                                    else {
                                        el.appendChild(Blend.dom.Element.create(child, elCallback, elCallbackScope).getEl());
                                    }
                                });
                                cfg = null;
                            }
                            else if (cfg === "data") {
                                Blend.forEach(val, function (v, k) {
                                    el.setAttribute("data-" + k, v);
                                });
                                cfg = null;
                            }
                            else if (cfg === "style") {
                                cfg = null;
                                Blend.getElement(el).setStyle(val);
                            }
                            else if (cfg === "selectable") {
                                if (val === false) {
                                    Blend.getElement(el).selectable(false);
                                }
                                cfg = null;
                            }
                            if (cfg) {
                                el.setAttribute(cfg, val);
                            }
                        }
                    }
                    var wEl = new Blend.dom.Element(el);
                    if (elCallback && config.oid) {
                        elCallback.apply(elCallbackScope || window, [wEl, config.oid]);
                    }
                    return wEl;
                }
                else {
                    return Blend.createElement({});
                }
            };
            return Element;
        }(Blend.Component));
        dom.Element = Element;
    })(dom = Blend.dom || (Blend.dom = {}));
})(Blend || (Blend = {}));
var Blend;
(function (Blend) {
    /**
     * Wrapper for Blend.dom.Element.create
     */
    Blend.createElement = Blend.dom.Element.create;
    /**
     * Wrapper for document.querySelector
     */
    function selectElement(query, from) {
        if (from === void 0) { from = null; }
        var els = Blend.selectElements(query, from);
        return els[0] || null;
    }
    Blend.selectElement = selectElement;
    /**
     * Wrapper for document.querySelectorAll
     */
    function selectElements(query, from) {
        if (from === void 0) { from = null; }
        var els = [];
        Blend.forEach(((from ? from.getEl() : null) || document).querySelectorAll(query), function (el) {
            if (Blend.isInstanceOf(el, HTMLElement)) {
                els.push(new Blend.dom.Element(el));
            }
        });
        return els;
    }
    Blend.selectElements = selectElements;
    /**
     * Wrapper for document.getElementById
      */
    function getElement(el) {
        if (Blend.isString(el)) {
            return new Blend.dom.Element(document.getElementById(el));
        }
        else {
            return new Blend.dom.Element(el);
        }
    }
    Blend.getElement = getElement;
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="binding/BindingProvider.ts" />
var Blend;
(function (Blend) {
    /**
     * Provides functionality to get Blend kickstarted and check for
     * brower compatibility
     */
    var RuntimeSingleton = (function () {
        function RuntimeSingleton() {
            this.kickStarted = false;
            this.Binder = new Blend.binding.BindingProvider();
            this.mediaQueryRegistery = {};
            this.mediaQueryMatchers = {};
        }
        /**
         * Used to trigger the media query matching on application.
         */
        RuntimeSingleton.prototype.triggerMediaQueryCheck = function () {
            var me = this;
            Blend.forEach(me.mediaQueryMatchers, function (mql, mediaQuery) {
                if (mql.matches && me.previousMediaQuery !== mediaQuery) {
                    me.mediaQueryRegistery[mediaQuery].forEach(function (fn) {
                        fn.apply(me, [mql]);
                    });
                    me.previousMediaQuery = mediaQuery;
                    return false;
                }
            });
        };
        /**
         * Adds a media query listener
         */
        RuntimeSingleton.prototype.addMediaQueryListener = function (mediaQuery, listener) {
            var me = this;
            if (me.mediaQueryRegistery[mediaQuery] === undefined) {
                me.mediaQueryRegistery[mediaQuery] = [];
                var mql = window.matchMedia(mediaQuery);
                me.mediaQueryMatchers[mediaQuery] = mql;
                mql.addListener(function () {
                    me.triggerMediaQueryCheck();
                });
            }
            me.mediaQueryRegistery[mediaQuery].push(listener);
        };
        /**
         * Checks if the current browser is supported
          */
        RuntimeSingleton.prototype.isSupportedBrowser = function () {
            var me = this, ie = me.detectIE();
            me.IE = ie !== 0;
            me.IEVersion = ie;
            if (ie !== 0 && ie < 11) {
                document.write("<div id=\"noblend\">Unable to run this application. Please upgrade your Internet Explorer to version 11 or above, otherwise use Google Chrome or Firefox!</div>");
                return false;
            }
            else {
                return true;
            }
        };
        /**
         * Resets the "ready" callback buffer
         */
        RuntimeSingleton.prototype.reset = function () {
            var me = this;
            me.readyCallbacks = [];
        };
        /**
         * Adds a callback function to run when the browser is ready to go
         */
        RuntimeSingleton.prototype.ready = function (callback, scope) {
            var me = this;
            if (!me.readyCallbacks) {
                me.readyCallbacks = [];
            }
            me.readyCallbacks.push({
                fn: callback,
                sc: scope || me
            });
            return this;
        };
        /**
         * Initiates Blend's application lifecycle by executing the callbacks
         * which are registered by {Environment.ready}. This function needs to called
         * to get a Blend application started.
         */
        RuntimeSingleton.prototype.kickStart = function () {
            var me = this, didRun = false, doCallback = function () {
                if (didRun === false) {
                    didRun = true;
                    if (me.isSupportedBrowser()) {
                        Blend.forEach(me.readyCallbacks, function (item) {
                            item.fn.apply(item.sc, []);
                        });
                    }
                }
                // empty the callbacks after running once incase we have late
                // ready(...) calls later, so we don't run previous calls again.
                me.readyCallbacks = [];
            };
            if (!me.kickStarted) {
                me.kickStarted = true;
                if (document.readyState === "complete") {
                    doCallback.apply(me, []);
                }
                else {
                    me.addEventListener(document, "DOMContentLoaded", doCallback);
                    me.addEventListener(window, "load", doCallback);
                }
            }
            else {
                doCallback.apply(me, []);
            }
        };
        /**
         * Adds an EventListener to an EventTarget. You can add multiple events by
         * providing event names seperated by spaces (eg. 'mouseup click')
         */
        RuntimeSingleton.prototype.addEventListener = function (el, eventName, eventHandler) {
            if (eventName.indexOf(" ") !== -1) {
                eventName.split(" ").forEach(function (eName) {
                    eName = eName.trim();
                    if (eName.length !== 0) {
                        el.addEventListener(eName, eventHandler, false);
                    }
                });
            }
            else {
                el.addEventListener(eventName, eventHandler, false);
            }
        };
        /**
         * Removes an EventListener from an EventTarget. You can remove multiple events by
         * providing event names seperated by spaces (eg. 'mouseup click')
         */
        RuntimeSingleton.prototype.removeEventListener = function (el, eventName, eventHandler) {
            if (eventName.indexOf(" ") !== -1) {
                eventName.split(" ").forEach(function (eName) {
                    eName = eName.trim();
                    if (eName.length !== 0) {
                        el.removeEventListener(eName, eventHandler, false);
                    }
                });
            }
            else {
                el.removeEventListener(eventName, eventHandler, false);
            }
        };
        RuntimeSingleton.prototype.detectIE = function () {
            // copyright http://codepen.io/gapcode/pen/vEJNZN
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
            }
            var trident = ua.indexOf("Trident/");
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf("rv:");
                return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
            }
            var edge = ua.indexOf("Edge/");
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
            }
            return 0;
        };
        return RuntimeSingleton;
    }());
    Blend.RuntimeSingleton = RuntimeSingleton;
    /**
     * Global reference to the RuntimeSingleton
     */
    Blend.Runtime = new RuntimeSingleton();
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="common/Utils.ts" />
/// <reference path="dom/Element.ts" />
/// <reference path="./Runtime.ts" />
var Blend;
(function (Blend) {
    var eMediaQuery = (function () {
        function eMediaQuery() {
        }
        eMediaQuery.LARGE = "L";
        eMediaQuery.MEDIUM = "M";
        eMediaQuery.SMALL = "S";
        return eMediaQuery;
    }());
    Blend.eMediaQuery = eMediaQuery;
    /**
     * Element Scroll values
     */
    (function (eScrollState) {
        eScrollState[eScrollState["none"] = 0] = "none";
        eScrollState[eScrollState["auto"] = 1] = "auto";
        eScrollState[eScrollState["both"] = 2] = "both";
        eScrollState[eScrollState["horizontal"] = 3] = "horizontal";
        eScrollState[eScrollState["vertical"] = 4] = "vertical";
    })(Blend.eScrollState || (Blend.eScrollState = {}));
    var eScrollState = Blend.eScrollState;
    Blend.registry = {};
    /**
     * Put the framework in DEBUG mode
     */
    Blend.DEBUG = false;
    var ID = 1000;
    Blend.COMMON_MEDIA_QUERIES = {};
    /**
     * IMPORTANT: For the media queries to work properly, we need to define them from
     * large to small because the Media Query check will match the first one and
     * trigger the responsiveChange event and other matching mediea queries will be
     * ignored!
     */
    Blend.COMMON_MEDIA_QUERIES[eMediaQuery.LARGE] = "(min-width : 840px)";
    Blend.COMMON_MEDIA_QUERIES[eMediaQuery.MEDIUM] = "(min-width: 480px) and (max-width: 839px)";
    Blend.COMMON_MEDIA_QUERIES[eMediaQuery.SMALL] = "(max-width : 479px)";
    /**
     * Bind wraps a function into a new functions so it can run in a given scope
     * whn the new function is called.
     */
    function bind(scope, fn) {
        return function () {
            fn.apply(scope, arguments);
        };
    }
    Blend.bind = bind;
    /**
     * Generates a new sequential ID used internally for debugging
     */
    function newID() {
        return ID++;
    }
    Blend.newID = newID;
    /**
     * Returns enum value, either the value as number or its string representation
     */
    function parseEnum(objEnum, value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        if (Blend.isString(value)) {
            return objEnum[value] === undefined ? defaultValue : objEnum[value];
        }
        else {
            return objEnum[objEnum[value]] === undefined ? defaultValue : objEnum[objEnum[value]];
        }
    }
    Blend.parseEnum = parseEnum;
    /**
     * Checks if the given value is a function
     */
    function isFunction(value) {
        return (typeof value === "function");
    }
    Blend.isFunction = isFunction;
    /**
     * Checks if the given value is a string
     */
    function isString(value) {
        return (typeof value === "string");
    }
    Blend.isString = isString;
    /**
     * Checks if the given value is null or undefined
     */
    function isNullOrUndef(value) {
        return (value === null || value === undefined);
    }
    Blend.isNullOrUndef = isNullOrUndef;
    /**
      * Checks if the given value is an array
      */
    function isArray(value) {
        return Object.prototype.toString.apply(value) === "[object Array]";
    }
    Blend.isArray = isArray;
    /**
     * Checks if the given value is a number
     */
    function isNumeric(value) {
        // Original source: JQuery
        return value - parseFloat(value) >= 0;
    }
    Blend.isNumeric = isNumeric;
    /**
     * Checks if the given value is an object
     */
    function isObject(value) {
        return (typeof value === "object" &&
            (typeof value !== "function" &&
                value !== null &&
                value !== undefined &&
                !Blend.isArray(value)));
    }
    Blend.isObject = isObject;
    /**
     * Wraps an object in an array if the object is not an array itself
     */
    function wrapInArray(obj) {
        return Blend.isArray(obj) ? obj : Blend.isNullOrUndef(obj) ? [] : [obj];
    }
    Blend.wrapInArray = wrapInArray;
    /**
     * Copies keys and values from one object to another
     * @param {any} target
     * @param {any} source
     * @param {boolean} overwrite the child objects or arrays
     * @param {mergeArrays} will merge arrays instead of overwriting them
     */
    function apply(target, source, overwrite, mergeArrays) {
        if (overwrite === void 0) { overwrite = false; }
        if (mergeArrays === void 0) { mergeArrays = false; }
        var key, targetKeys = Object.keys(target || {}), targetHasKey = function (key) {
            return targetKeys.indexOf(key) !== -1;
        };
        overwrite = overwrite || false;
        mergeArrays = mergeArrays || false;
        if (target && source) {
            for (key in source) {
                if (key && source.hasOwnProperty(key)) {
                    if (targetHasKey(key) && Blend.isObject(target[key])) {
                        if (overwrite) {
                            target[key] = source[key];
                        }
                        else {
                            Blend.apply(target[key], source[key]);
                        }
                    }
                    else if (targetHasKey(key) && Blend.isArray(target[key]) && mergeArrays === true) {
                        target[key] = target[key].concat(Blend.wrapInArray(source[key]));
                    }
                    else if (targetHasKey(key) && overwrite) {
                        target[key] = source[key];
                    }
                    else if (Blend.isNullOrUndef(target[key])) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    }
    Blend.apply = apply;
    /**
     * Checks if the given value is a boolean
     */
    function isBoolean(value) {
        return (typeof (value) === "boolean");
    }
    Blend.isBoolean = isBoolean;
    /**
     * Checks if the give value is instance of another class/function
     */
    function isInstanceOf(obj, clazz) {
        if (obj === null || obj === undefined) {
            return false;
        }
        var hc = "[object HTMLCollection]";
        if (obj.toString() === hc && clazz === "HTMLCollection") {
            return true;
        }
        else {
            if (Blend.isString(clazz)) {
                var fn = new Function("", " try { return " + clazz + " } catch(e) { return null };");
                clazz = fn();
            }
            try {
                var res = (obj instanceof clazz);
                return res;
            }
            catch (e) {
                return false;
            }
        }
    }
    Blend.isInstanceOf = isInstanceOf;
    /**
     * Loops though the given object (array, dictionary) and runs a callback on each item.
     * The callback loop will break when the callback function returns "false" explicitly!
     * The callback has the following signature:
     * function(item:any, index:number|string, scope:any = obj) {
     * }
     */
    function forEach(obj, callback, scope) {
        if (typeof HTMLCollection === "undefined") {
            var HTMLCollection = function () {
                //
            };
        }
        var key;
        if (obj) {
            if (Blend.isFunction(obj)) {
                return;
            }
            else if (Blend.isArray(obj)) {
                var length = obj.length;
                for (key = 0; key < length; key++) {
                    if (callback.call(scope, obj[key], parseInt(key), obj) === false) {
                        break;
                    }
                }
            }
            else if (Blend.isInstanceOf(obj, "HTMLCollection")) {
                var length = obj.length, key, el;
                for (key = 0; key !== length; key++) {
                    el = obj.item(key);
                    if (key !== "length") {
                        if (callback.call(scope, el, parseInt(key), obj) === false) {
                            break;
                        }
                    }
                }
            }
            else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (callback.call(scope, obj[key], key, obj) === false) {
                            break;
                        }
                    }
                }
            }
        }
    }
    Blend.forEach = forEach;
    /**
     *  Create a new Blend.Component object
     */
    function createComponent(clazz, config) {
        if (config === void 0) { config = null; }
        if (typeof (clazz) === "string") {
            if (Blend.registry[clazz]) {
                return Blend.createComponent(Blend.registry[clazz], config);
            }
            else {
                throw new Error("Unknown class alias " + clazz);
            }
        }
        else if (Blend.isClass(clazz)) {
            return new clazz(config || {});
        }
        else if (clazz !== null && clazz !== undefined && typeof (clazz) === "object" && clazz.ctype) {
            var ctype = clazz.ctype;
            delete (clazz.ctype);
            return Blend.createComponent(ctype, Blend.apply(clazz, config));
        }
        else {
            throw new Error("Unable to create an object from " + clazz);
        }
    }
    Blend.createComponent = createComponent;
    function isClass(clazz) {
        return typeof (clazz) === "function" && !!Object.keys(clazz.prototype).length === true;
    }
    Blend.isClass = isClass;
    /**
     * Registers a class with a given alias into the class registry so we can
     * instantiate an object with createObjectWithAlias.
     */
    function registerClassWithAlias(alias, clazz) {
        if (!Blend.registry[alias]) {
            Blend.registry[alias] = clazz;
        }
        else {
            throw new Error("A Class with alias " + alias + " is already registered!");
        }
    }
    Blend.registerClassWithAlias = registerClassWithAlias;
})(Blend || (Blend = {}));
var Blend;
(function (Blend) {
    Blend.version = "v4.0.0";
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Blend.ts" />
/// <reference path="../Component.ts" />
var Blend;
(function (Blend) {
    var ajax;
    (function (ajax) {
        /**
         * Base class for an Ajax Request
         */
        var AjaxRequest = (function (_super) {
            __extends(AjaxRequest, _super);
            function AjaxRequest(config) {
                _super.call(this);
                var me = this, cfg;
                if (Blend.isString(config)) {
                    cfg = {
                        url: config || null
                    };
                }
                else {
                    cfg = config;
                }
                me.url = cfg.url || null;
                me.headers = cfg.headers || {};
                me.onComplete = cfg.onComplete || null;
                me.onProgress = cfg.onProgress || null;
                me.onFailed = cfg.onFailed || null;
                me.onSuccess = cfg.onSuccess || null;
                me.onStart = cfg.onStart || null;
                me.onPrepareUpload = cfg.onPrepareUpload || null;
                me.scope = cfg.scope | me;
                me.xhrConfig = {
                    withCredentials: cfg.withCredentials === true ? true : false
                };
                me.initialize();
            }
            AjaxRequest.prototype.initialize = function () {
                var me = this, handlers = {
                    progress: me.updateProgress,
                    load: me.transferComplete,
                    error: me.transferFailed,
                    abort: me.transferCanceled
                };
                me.xhr = new XMLHttpRequest();
                Blend.forEach(handlers, function (handler, eventName) {
                    me.xhr.addEventListener(eventName, function (evt) {
                        handler.apply(me, [me.xhr, evt]);
                    });
                });
                Blend.forEach(me.headers, function (value, header) {
                    me.xhr.setRequestHeader(header, value);
                });
                Blend.forEach(me.xhrConfig, function (value, key) {
                    me.xhr[key] = value;
                });
            };
            AjaxRequest.prototype.sendRequest = function (data) {
                if (data === void 0) { data = {}; }
                var me = this;
                me.callID = (new Date()).getTime();
                if (me.callHandler("onStart", arguments) !== false) {
                    me.doSendRequest(data);
                }
                else {
                    me.transferCanceled(me.xhr, null);
                }
            };
            AjaxRequest.prototype.updateProgress = function (request, evt) {
                var me = this;
                me.callHandler("onProgress", arguments);
            };
            AjaxRequest.prototype.transferComplete = function (request, evt) {
                var me = this;
                if (request.status >= 300) {
                    me.transferFailed.apply(me, arguments);
                }
                else if (request.status < 300) {
                    me.callHandler("onSuccess", arguments);
                }
                me.callHandler("onComplete", arguments);
            };
            AjaxRequest.prototype.transferFailed = function (request, evt) {
                var me = this;
                me.callHandler("onFailed", arguments);
            };
            AjaxRequest.prototype.transferCanceled = function (request, evt) {
                var me = this;
                me.transferFailed(request, evt);
            };
            /**
             * File prepare event notification
             */
            AjaxRequest.prototype.notifyPrepareUpload = function (file, status) {
                this.callHandler("onPrepareUpload", arguments);
            };
            /**
             * Calls a registerend handler by name
             */
            AjaxRequest.prototype.callHandler = function (name, args) {
                var me = this;
                if (me[name]) {
                    return me[name].apply(me.scope || me, args);
                }
                else {
                    return undefined;
                }
            };
            /**
             * URI encode a string value
             */
            AjaxRequest.prototype.encodeURIComponent = function (value) {
                return encodeURIComponent(value).replace(/[!'()*]/g, function (c) {
                    return "%" + c.charCodeAt(0).toString(16);
                });
            };
            /**
             * URL encode a Dictionary
             */
            AjaxRequest.prototype.urlEncodeData = function (data) {
                var me = this, payload = [];
                Blend.forEach(data, function (value, key) {
                    payload.push(key + "=" + me.encodeURIComponent(value));
                });
                return payload.join("&").trim();
            };
            /**
             * Creates or updates the current URL by adding a call ID ti bypass browser caching
             */
            AjaxRequest.prototype.createURI = function (data) {
                if (data === void 0) { data = {}; }
                var me = this;
                data = data || {};
                data["_c"] = me.callID;
                return (me.url
                    + (me.url.indexOf("?") === -1 ? "?" : "&")
                    + me.urlEncodeData(data));
            };
            return AjaxRequest;
        }(Blend.Component));
        ajax.AjaxRequest = AjaxRequest;
    })(ajax = Blend.ajax || (Blend.ajax = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Blend.ts" />
/// <reference path="AjaxRequest.ts" />
var Blend;
(function (Blend) {
    var ajax;
    (function (ajax) {
        /**
         * AjaxGetRequest implements a GET request
         */
        var AjaxGetRequest = (function (_super) {
            __extends(AjaxGetRequest, _super);
            function AjaxGetRequest() {
                _super.apply(this, arguments);
            }
            AjaxGetRequest.prototype.doSendRequest = function (data) {
                if (data === void 0) { data = {}; }
                var me = this;
                me.xhr.open("GET", me.createURI(data), true);
                me.xhr.send(null);
            };
            return AjaxGetRequest;
        }(Blend.ajax.AjaxRequest));
        ajax.AjaxGetRequest = AjaxGetRequest;
    })(ajax = Blend.ajax || (Blend.ajax = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Blend.ts" />
/// <reference path="AjaxRequest.ts" />
var Blend;
(function (Blend) {
    var ajax;
    (function (ajax) {
        /**
         * AjaxPostRequest implements a POST request with File uploading capabilities
         */
        var AjaxPostRequest = (function (_super) {
            __extends(AjaxPostRequest, _super);
            function AjaxPostRequest() {
                _super.apply(this, arguments);
                /**
                 * Converts an ArrayBuffer (File) to a string
                 */
                this.arrayBufferToString = function (result) {
                    var binary = "";
                    var bytes = new Uint8Array(result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    return binary;
                };
            }
            AjaxPostRequest.prototype.doSendRequest = function (data) {
                if (data === void 0) { data = {}; }
                var me = this;
                me.readyToSend = true;
                me.boundary = "!!@@##" + me.callID + "##@@!!";
                me.dataItemHeader = "--" + me.boundary + "\r\nContent-Disposition: form-data;";
                me.xhr.open("POST", me.createURI(), true);
                me.xhr.setRequestHeader("Content-Type", "multipart\/form-data; boundary=" + me.boundary);
                me.boundaryEncodeData(data, function (encodedData) {
                    me.xhr.setRequestHeader("Content-Length", encodedData.length.toString());
                    me.xhr.sendAsBinary(encodedData);
                });
            };
            /**
             * Encode the data that is to be sent (POST) asynchronously
             */
            AjaxPostRequest.prototype.boundaryEncodeData = function (data, callback) {
                var me = this, pendingConverts = 0, payload = [];
                Blend.forEach(data, function (value, key) {
                    if (Blend.isInstanceOf(value, FileList)) {
                        pendingConverts += me.encodeFileList(value, payload, function () {
                            pendingConverts -= 1;
                        });
                    }
                    else {
                        payload.push(me.encodeDataItem(key, value));
                    }
                });
                var waitId = setInterval(function () {
                    if (pendingConverts === 0) {
                        clearInterval(waitId);
                        payload.push("--" + me.boundary + "--\r\n");
                        callback.apply(me, [payload.join("")]);
                    }
                }, 250);
            };
            /**
             * Encodes a FileList
             */
            AjaxPostRequest.prototype.encodeFileList = function (files, payload, onFinish) {
                var me = this, currentFile, filetype, nextFile = 0, reader = new FileReader();
                reader.onload = function (evt) {
                    filetype = currentFile.type === "" ? "application/octet-stream" : currentFile.type;
                    payload.push(me.dataItemHeader + " name=\"" + currentFile.name + "\"; filename=\"" + currentFile.name + "\"\r\nContent-Type: " + filetype + "\r\n\r\n" + me.arrayBufferToString(reader.result) + "\r\n");
                    onFinish.apply(me, []);
                    me.notifyPrepareUpload(currentFile, 2);
                    nextFile += 1;
                    doWork();
                };
                reader.onprogress = function (evt) {
                    me.notifyPrepareUpload(currentFile, 1);
                };
                var doWork = function () {
                    if (files[nextFile]) {
                        currentFile = files[nextFile];
                        me.notifyPrepareUpload(currentFile, 0);
                        reader.readAsArrayBuffer(currentFile);
                    }
                };
                doWork();
                return files.length;
            };
            /**
             * Encodes simple data items
             */
            AjaxPostRequest.prototype.encodeDataItem = function (key, value) {
                var me = this;
                return me.dataItemHeader + " name=\"" + key + "\"\r\n\r\n" + value + "\r\n";
            };
            return AjaxPostRequest;
        }(Blend.ajax.AjaxRequest));
        ajax.AjaxPostRequest = AjaxPostRequest;
    })(ajax = Blend.ajax || (Blend.ajax = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Typings.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../Component.ts" />
var Blend;
(function (Blend) {
    var mvc;
    (function (mvc) {
        /**
         * Abstract class providing controller regsiteration and event publishing
         * This class is the base class for View and the Context
         */
        var Client = (function (_super) {
            __extends(Client, _super);
            function Client(config) {
                if (config === void 0) { config = {}; }
                _super.call(this, config);
                var me = this;
                me.controllers = [];
                me.addController(config.controller || []);
            }
            /**
             * Fires an event towards the Controllers within this View
             */
            Client.prototype.fireEventWithScope = function (scope, eventName, args) {
                var me = this;
                if (me.controllers) {
                    Blend.forEach(me.controllers, function (controller) {
                        if (controller.delegate) {
                            controller.delegate(eventName, scope, args);
                        }
                        else {
                            // function controller
                            controller.apply(scope, [scope, eventName].concat(args));
                        }
                    });
                }
            };
            /**
             * Adds (registers) Controllers with this client
             */
            Client.prototype.addController = function (controllers) {
                var me = this, ctrl;
                Blend.forEach(Blend.wrapInArray(controllers), function (item) {
                    if (Blend.isClass(item) || Blend.isString(item)) {
                        ctrl = Blend.createComponent(item);
                    }
                    else if (Blend.isObject(item)) {
                        ctrl = item;
                    }
                    else if (Blend.isFunction(item)) {
                        ctrl = item;
                    }
                    if (Blend.isInstanceOf(ctrl, Blend.mvc.Controller)) {
                        ctrl.bindView(me);
                        me.controllers.push(ctrl);
                    }
                    else if (Blend.isFunction(ctrl)) {
                        me.controllers.push(function () { return ctrl.apply(me, arguments); });
                    }
                    else {
                        throw new Error(ctrl + " is not a valid Blend.mvc.Controller");
                    }
                });
            };
            return Client;
        }(Blend.Component));
        mvc.Client = Client;
    })(mvc = Blend.mvc || (Blend.mvc = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Typings.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="Client.ts" />
var Blend;
(function (Blend) {
    var mvc;
    (function (mvc) {
        var View = (function (_super) {
            __extends(View, _super);
            function View(config) {
                if (config === void 0) { config = {}; }
                _super.call(this, config);
                var me = this;
                me.reference = config.reference || null;
                me.currentEventName = null;
                me.setContext(config.context || null);
                me.disableEvents();
            }
            /**
             * Sets the global MVC context
              */
            View.prototype.setContext = function (context) {
                var me = this;
                me.context = context;
            };
            /**
             * Checks to see if we have a global MVC context
             */
            View.prototype.hasContext = function () {
                return !Blend.isNullOrUndef(this.context);
            };
            /**
             * Disables the event and notification on this View
             */
            View.prototype.disableEvents = function () {
                this.eventsEnabled = false;
                return this;
            };
            /**
             * Enables the event and notification on this view
             */
            View.prototype.enableEvents = function () {
                this.eventsEnabled = true;
                return this;
            };
            /**
             * Gets the reference identifier for this View
             */
            View.prototype.getReference = function () {
                return this.reference || null;
            };
            View.prototype.canFireEvents = function () {
                return this.eventsEnabled === true;
            };
            /**
             * Fires an event towards the Controllers within this View
             * and the current global Context is possible
             */
            View.prototype.fireEvent = function (eventName) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var me = this;
                me.currentEventName = eventName;
                if (me.canFireEvents() === true) {
                    this.fireEventWithScope(me, eventName, args);
                    if (me.context !== null) {
                        me.context.delegate(eventName, me, args);
                    }
                }
                return this;
            };
            return View;
        }(Blend.mvc.Client));
        mvc.View = View;
    })(mvc = Blend.mvc || (Blend.mvc = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Typings.ts" />
/// <reference path="../Component.ts" />
/// <reference path="View.ts" />
/// <reference path="Client.ts" />
var Blend;
(function (Blend) {
    var mvc;
    (function (mvc) {
        /**
         * Base class for a Controller.
         */
        var Controller = (function (_super) {
            __extends(Controller, _super);
            function Controller(config) {
                if (config === void 0) { config = {}; }
                _super.call(this, config);
                this.handlers = {};
                this.initEvents();
            }
            Controller.prototype.initEvents = function () {
            };
            /**
             * @internal
             * Delegates an event to the regisreted handlers in this controller
             */
            Controller.prototype.delegate = function (eventName, view, args) {
                var me = this, reference = view.getReference ? view.getReference() : "", handlers = me.handlers[eventName] || me.handlers[reference + "." + eventName] || null;
                if (handlers && handlers.length !== 0) {
                    handlers.forEach(function (handler) {
                        setTimeout(function () {
                            try {
                                handler.apply(me, [view].concat(args));
                            }
                            catch (error) {
                            }
                        }, 2);
                    });
                }
            };
            /**
             * Registers an event handler within this controller
             */
            Controller.prototype.on = function (eventName, handler) {
                var me = this;
                if (!me.handlers[eventName]) {
                    me.handlers[eventName] = [handler];
                }
                else {
                    me.handlers[eventName].push(handler);
                }
            };
            /**
             * @internal
             * Registers a View's reference within this controller
             */
            Controller.prototype.bindView = function (view) {
                var me = this, reference = (view.getReference ? view.getReference() : null); // trick to bypass the Context object
                if (reference !== null) {
                    if (me[reference] === null) {
                        me[reference] = view;
                    }
                    else if (Blend.isArray(me[reference])) {
                        me[reference].push(view);
                    }
                }
            };
            return Controller;
        }(Blend.Component));
        mvc.Controller = Controller;
    })(mvc = Blend.mvc || (Blend.mvc = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Typings.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="Controller.ts" />
/// <reference path="Client.ts" />
var Blend;
(function (Blend) {
    var mvc;
    (function (mvc) {
        /**
         * Represents a context that hols instanses of controllers an other
         *  mvc related state
         */
        var Context = (function (_super) {
            __extends(Context, _super);
            function Context() {
                _super.apply(this, arguments);
            }
            /**
             * Delegates an event to the Controllers within this Context
             */
            Context.prototype.delegate = function (eventName, sender, args) {
                this.fireEventWithScope(sender, eventName, args);
            };
            return Context;
        }(Blend.mvc.Client));
        mvc.Context = Context;
    })(mvc = Blend.mvc || (Blend.mvc = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../mvc/View.ts" />
/// <reference path="../dom/Element.ts" />
var Blend;
(function (Blend) {
    var material;
    (function (material) {
        /**
         * Abstract base class for a Material
         */
        var Material = (function (_super) {
            __extends(Material, _super);
            function Material(config) {
                if (config === void 0) { config = {}; }
                _super.call(this, config);
                var me = this;
                me.isInitialized = false;
                me.parent = config.parent || null;
                me.useParentControllers = config.useParentController || false;
                me.isRendered = false;
                me.visible = true;
                me.config = {
                    css: [],
                    style: {},
                    visible: true,
                    top: null,
                    left: null,
                    width: null,
                    height: null,
                    responsive: config.responsive || false,
                    responseTo: config.responseTo || null
                };
                me.addCssClass(config.css || []);
                me.setStyle(config.style || {});
                me.setVisible(Blend.isBoolean(config.visible) ? config.visible : me.visible);
                me.setBounds({
                    top: config.top || null,
                    left: config.left || null,
                    width: config.width || null,
                    height: config.height || null
                });
                me.initializeResponsiveEvents();
                me.canLayout = true;
            }
            /**
             * Internal function used for initiating a sub-layout process. This function can be
             * overridden when implementing a custom component. See the Button component as
             * an example of how to use this function
             */
            Material.prototype.updateLayout = function () {
            };
            /**
             * Initiates a sub-layout process.
             */
            Material.prototype.performLayout = function () {
                var me = this;
                if (me.canLayout === true) {
                    me.suspendLayout();
                    me.updateLayout();
                    me.resumeLayout();
                }
            };
            /**
             * Suspends the sub-layout from staring
             */
            Material.prototype.suspendLayout = function () {
                this.canLayout = false;
            };
            /**
             * Resumes the sub-layout
             */
            Material.prototype.resumeLayout = function () {
                this.canLayout = true;
            };
            /**
             * This function is used internally on render time to assign element IDs to
             * properties
             */
            Material.prototype.assignElementByOID = function (el, oid) {
                var me = this;
                if (me[oid] === null) {
                    me[oid] = el;
                }
            };
            /**
             * Initialized a responsive listener for this Material by adding a listener to the
             * Runtime.addMediaQueryListener
             */
            Material.prototype.initializeResponsiveEvents = function () {
                var me = this, config;
                config = me.config.responsive === true ? Blend.COMMON_MEDIA_QUERIES
                    : me.config.responseTo || null;
                if (config !== null) {
                    Blend.forEach(config, function (queries, alias) {
                        queries = Blend.wrapInArray(queries);
                        queries.forEach(function (mediaQuery) {
                            Blend.Runtime.addMediaQueryListener(mediaQuery, function (mql) {
                                me.fireEvent("responsiveChanged", alias, mql);
                            });
                        });
                    });
                }
            };
            Material.prototype.getProperty = function (name, defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                var me = this;
                if (name.indexOf("config.", 0) === 0) {
                    name = name.replace("config.", "").trim();
                    return (me.config[name] === undefined ? defaultValue : me.config[name]);
                }
                else {
                    return _super.prototype.getProperty.call(this, name, defaultValue);
                }
            };
            Material.prototype.render = function () {
                return Blend.dom.Element.create({});
            };
            /**
             * Sends a materialInitialized notification
             */
            Material.prototype.notifyMaterialInitialized = function () {
                var me = this;
                me.fireEvent("materialInitialized", me);
            };
            /**
             * DO NOT USE THIS FUNCTION!
             * Internal function that is called by the parent/host to initiate
             * the initialization process
              */
            Material.prototype.doInitialize = function () {
                var me = this;
                me.initEvents();
                me.initialize();
                me.performLayout();
                me.notifyMaterialInitialized();
                return me;
            };
            /**
             * This function can be overriden to do custom initialization on this Material
             */
            Material.prototype.initialize = function () {
            };
            /**
             * Override this method for creating event listeners for this Material
             */
            Material.prototype.initEvents = function () {
            };
            /**
             * Check if events can be fired on this Material
             */
            Material.prototype.canFireEvents = function () {
                var me = this, state;
                if (_super.prototype.canFireEvents.call(this)) {
                    if (me.parent !== null) {
                        state = me.parent.canFireEvents();
                    }
                    else {
                        state = true;
                    }
                }
                else {
                    state = false;
                }
                if (state === false && me.currentEventName === "materialInitialized") {
                    return true;
                }
                else {
                    return state;
                }
            };
            /////////////////////////////////////////////////////////////////////////
            // BOUNDS
            /////////////////////////////////////////////////////////////////////////
            /**
             * Returns the bounds of this Material based on the ElementBoundsInterface interface
             */
            Material.prototype.getBounds = function () {
                var me = this;
                if (me.isRendered) {
                    return me.element.getBounds();
                }
                else {
                    return null;
                }
            };
            /**
             * Sets the bounds of this Material based on the ElementBoundsInterface interface
             */
            Material.prototype.setBounds = function (bounds) {
                var me = this, nullBounds = { top: null, left: null, width: null, height: null };
                if (me.isRendered) {
                    me.setStyle(bounds === null ? nullBounds : bounds);
                }
                else {
                    Blend.apply(me.config, bounds === null ? nullBounds : bounds);
                }
                me.notifyBoundsChanged();
                return this;
            };
            /**
             * Sends boundsChanged notification
             */
            Material.prototype.notifyBoundsChanged = function () {
                var me = this;
                if (me.isRendered) {
                    me.fireEvent("boundsChanged", me.getBounds());
                }
            };
            /////////////////////////////////////////////////////////////////////////
            // VISIBILITY
            //////////////////////////////////////////////////////////////////////////
            /**
             * Sets the visibility state for this Material
             */
            Material.prototype.setVisible = function (visible) {
                if (visible === void 0) { visible = true; }
                var me = this;
                me.visible = visible === true ? true : false;
                if (me.isRendered) {
                    me.element.setData("visible", me.visible);
                }
                else {
                    me.config.visible = me.visible;
                }
                me.notifyVisibilityChanged();
                return this;
            };
            /**
             * gets the visibility state of this Material
             */
            Material.prototype.isVisible = function () {
                var me = this;
                return me.visible;
            };
            /**
             * Sends a visibilityChanged notification
             */
            Material.prototype.notifyVisibilityChanged = function () {
                var me = this;
                me.fireEvent("visibilityChanged", me.visible);
            };
            /////////////////////////////////////////////////////////////////////////
            // STYLE and CSS
            //////////////////////////////////////////////////////////////////////////
            /**
             * Sets the Styles for this Material
             * */
            Material.prototype.setStyle = function (style) {
                var me = this;
                if (me.isRendered) {
                    me.element.setStyle(style);
                }
                else {
                    Blend.apply(me.config.style, style, false, true);
                }
                me.notifyStyleOrCSSChanged();
            };
            /**
             * Adds one or more CSS classes to this Material
             */
            Material.prototype.addCssClass = function (css) {
                var me = this;
                if (me.isRendered) {
                    me.element.addCssClass(css);
                }
                else {
                    Blend.wrapInArray(css).forEach(function (itm) {
                        me.config.css.push(itm);
                    });
                }
                me.notifyStyleOrCSSChanged();
            };
            /**
             * Sends a visibilityChanged notification
             */
            Material.prototype.notifyStyleOrCSSChanged = function () {
                var me = this;
                me.fireEvent("styleChanged", me.visible);
            };
            /**
             *Helps configuring the this Material before the rendering cycle is complete
             */
            Material.prototype.finalizeRender = function () {
                var me = this;
                me.addCssClass(me.config.css);
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
                if (Blend.DEBUG === true) {
                    var id = "m" + Blend.newID();
                    me.element.getEl().setAttribute("id", id);
                    window[id] = me;
                }
            };
            /**
            * Retrives the HTMLElement for this Material
            */
            Material.prototype.getElement = function () {
                var me = this;
                if (!me.isRendered) {
                    me.disableEvents();
                    me.element = me.render();
                    me.isRendered = true;
                    me.finalizeRender();
                    me.enableEvents();
                }
                return me.element;
            };
            /**
             * Destroys this Material by setting the properties to null,
             * deleting them and removing its HTMLElement
             */
            Material.prototype.destroy = function () {
                var me = this;
                me.element.remove();
                Blend.forEach(me, function (value, key) {
                    me[key] = null;
                    delete (me[key]);
                });
            };
            return Material;
        }(Blend.mvc.View));
        material.Material = Material;
    })(material = Blend.material || (Blend.material = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Typings.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../mvc/Context.ts" />
/// <reference path="../material/Material.ts" />
var Blend;
(function (Blend) {
    var application;
    (function (application) {
        /**
         * Base class for implementing an Application component
         */
        var Application = (function (_super) {
            __extends(Application, _super);
            function Application(config) {
                if (config === void 0) { config = {}; }
                _super.call(this, Blend.apply(config, {
                    responsive: true
                }));
                var me = this;
                me.isStarted = false;
                me.isResizing = false;
                me.config.mainView = config.mainView || null;
                me.config.theme = config.theme || "default";
                me.config.style = {}; // remove use provided styles
                me.setContext(new Blend.mvc.Context());
                me.createMainView();
            }
            /**
             * Used to fire an event when the browser is resized
             */
            Application.prototype.notifyApplicationResized = function (evt) {
                var me = this;
                me.fireEvent("applicationResized", evt);
            };
            /**
             * Handle the resize notification correctly
             */
            Application.prototype.onWindowResize = function () {
                var me = this;
                if (!me.isResizing) {
                    me.isResizing = true;
                    me.notifyApplicationResized.apply(me, arguments);
                    me.isResizing = false;
                }
            };
            /**
             * Install an event listener on the window
             */
            Application.prototype.setupWindowListeners = function () {
                var me = this, tm = -1, counts = 0, curSize = -1;
                Blend.Runtime.addEventListener(window, "resize", function (evt) {
                    curSize = window.innerWidth + window.innerHeight;
                    clearInterval(tm);
                    tm = setInterval(function () {
                        if (counts >= 3) {
                            if (curSize === (window.innerWidth + innerHeight)) {
                                clearInterval(tm);
                                me.onWindowResize.apply(me, [evt]);
                            }
                            else {
                                counts = 0;
                            }
                        }
                        else {
                            counts++;
                        }
                    }, 50);
                });
            };
            /**
             * Fires when the application is ready for user interaction
             */
            Application.prototype.notifyApplicationReady = function () {
                var me = this;
                me.fireEvent("applicationReady");
            };
            Application.prototype.performInitialMediaQuery = function () {
                Blend.Runtime.triggerMediaQueryCheck();
            };
            Application.prototype.asyncRun = function () {
                var me = this, body = Blend.getElement(document.body);
                if (!me.isStarted) {
                    body.clearElement();
                    body.addCssClass(me.config.theme, false);
                    body.append(me.getElement());
                    me.setupWindowListeners();
                    me.performInitialMediaQuery();
                    me.doInitialize();
                    me.notifyApplicationReady();
                    me.isStarted = true;
                }
            };
            /**
             * Creates the main view of this application
             * */
            Application.prototype.createMainView = function () {
                var me = this;
                if (me.config.mainView) {
                    me.mainView = Blend.createComponent(me.config.mainView, {
                        parent: me
                    });
                    if (Blend.isInstanceOf(me.mainView, Blend.material.Material)) {
                        me.setContext(me.context);
                        me.mainView.addCssClass("mb-mainview");
                        if (me.mainView.getProperty("useParentController", true) === true) {
                            me.mainView.addController(me.controllers);
                        }
                    }
                    else {
                        throw new Error("The provide mainView is not a valid View instance!");
                    }
                }
                else {
                    throw new Error("Missing or invalid mainView!");
                }
            };
            Application.prototype.renderMainView = function () {
                return this.mainView.getElement();
            };
            Application.prototype.finalizeRender = function () {
                var me = this;
                _super.prototype.finalizeRender.call(this);
                /**
                 * We cleanup the main view bounds to force it to fit into the application
                 */
                me.mainView.setBounds({ top: null, left: null, width: null, height: null });
                me.mainView.setStyle({ display: null });
            };
            Application.prototype.render = function () {
                var me = this;
                return Blend.dom.Element.create({
                    cls: ["mb-application"],
                    children: [me.renderMainView()]
                });
            };
            /**
             * Entry point of a Blend application
             */
            Application.prototype.run = function () {
                var me = this;
                if (!me.isStarted) {
                    Blend.Runtime.ready(function () {
                        me.asyncRun.apply(me, arguments);
                    }, me);
                    Blend.Runtime.kickStart();
                }
            };
            return Application;
        }(Blend.material.Material));
        application.Application = Application;
    })(application = Blend.application || (Blend.application = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../../Typings.ts" />
/// <reference path="../../Blend.ts" />
/// <reference path="../../Component.ts" />
/// <reference path="../../dom/Element.ts" />
var Blend;
(function (Blend) {
    var material;
    (function (material) {
        var effect;
        (function (effect) {
            var Ripple = (function (_super) {
                __extends(Ripple, _super);
                function Ripple(config) {
                    if (config === void 0) { config = {}; }
                    _super.call(this, config);
                    var me = this;
                    me.removeQueue = [];
                    me.rippleDuration = 350;
                    me.skipMouseEvent = false;
                    me.center = config.center === true ? true : false;
                    me.element = config.element || null;
                    if (me.element !== null) {
                        me.bindEvents();
                        me.setRippleColor(config.color || null);
                    }
                }
                Ripple.prototype.bindEvents = function () {
                    var me = this;
                    if (me.element.getProperty("hasRipple", false) === false) {
                        me.element.addEventListener("mousedown", Blend.bind(me, me.handleDownEvent));
                        me.element.addEventListener("mouseup mouseleave", Blend.bind(me, me.handleHandleUpEvent));
                        me.element.setProperty("hasRipple", true);
                        me.createRippleContainer();
                    }
                };
                Ripple.prototype.createRippleContainer = function () {
                    var me = this, copyStyles = me.element.getStyle(["border-radius", "border-color", "border-width", "border-style"]);
                    me.container = me.element.append(Blend.createElement({
                        cls: "mb-ripple-container",
                        style: copyStyles
                    }));
                };
                Ripple.prototype.handleDownEvent = function (evt) {
                    var me = this, top, left, mouseEvent;
                    if (me.center === true) {
                        left = me.container.getEl().clientWidth / 2;
                        top = me.container.getEl().clientHeight / 2;
                    }
                    else {
                        mouseEvent = evt;
                        if (mouseEvent.srcElement !== me.container.getEl()) {
                            var crect = me.container.getEl().getBoundingClientRect();
                            left = mouseEvent.clientX - crect.left;
                            top = mouseEvent.clientY - crect.top;
                        }
                        else {
                            left = evt.offsetX;
                            top = evt.offsetY;
                        }
                    }
                    me.initiateRipple(left, top);
                };
                Ripple.prototype.handleHandleUpEvent = function () {
                    var me = this;
                    while (me.removeQueue.length !== 0) {
                        var ripple = me.removeQueue.splice(0, 1)[0];
                        setTimeout(function () {
                            ripple.removeCssClass(["mb-ripple-active"]);
                            setTimeout(function () {
                                ripple.getEl().parentNode.removeChild(ripple.getEl());
                            }, 2000);
                        }, me.rippleDuration * 0.4);
                    }
                };
                Ripple.prototype.initiateRipple = function (left, top) {
                    var me = this, ripple = me.container.append(Blend.createElement({
                        cls: ["mb-ripple"],
                        style: {
                            top: top,
                            left: left
                        }
                    })), width = me.element.getEl().clientWidth, height = me.element.getEl().clientHeight, x = Math.max(Math.abs(width - left), left) * 2, y = Math.max(Math.abs(height - top), top) * 2, size = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                    ripple.setStyle({
                        width: size,
                        height: size,
                        "background-color": me.color
                    });
                    ripple.addCssClass(["mb-ripple-placed"]);
                    setTimeout(function () {
                        ripple.addCssClass(["mb-ripple-scaled"]);
                        ripple.addCssClass(["mb-ripple-active"]);
                    }, 5);
                    me.removeQueue.push(ripple);
                };
                /**
                 * Converts a hex color to a RGB format
                 */
                Ripple.prototype.hexToRgb = function (value) {
                    if (Blend.isString(value) && value.length !== 0 && value[0] === "#") {
                        if (value.length === 4) {
                            var t = value.split("");
                            value = "#" + t[1] + t[1] + t[2] + t[2] + t[3] + t[3];
                        }
                        if (value.length === 7) {
                            var p = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
                            return p ? "rgba(" + parseInt(p[1], 16) + "," + parseInt(p[2], 16) + "," + parseInt(p[3], 16) + ")" : null;
                        }
                    }
                    return value;
                };
                Ripple.prototype.setRippleColor = function (color) {
                    var me = this, opacity = 0.95, prop = "color", clr, defaultColor = "rgb(0,0,0)";
                    if (Blend.isInstanceOf(color, Blend.dom.Element)) {
                        clr = color.getStyle(prop)[prop];
                    }
                    else {
                        clr = color;
                        if (clr && clr.length !== 0 && clr[0].inArray([".", "#"])) {
                            var el = Blend.selectElement(clr, me.element);
                            if (el) {
                                clr = el.getStyle(prop)[prop];
                            }
                        }
                        clr = me.hexToRgb(clr || defaultColor);
                    }
                    var t = clr.replace(/\brgba\b|\brgb\b|\s|\(|\)/g, "").split(",");
                    if (t.length >= 3) {
                        clr = "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + opacity + ")";
                    }
                    else {
                        clr = "rgba(0,0,0," + opacity + ")";
                    }
                    me.color = clr;
                };
                return Ripple;
            }(Blend.Component));
            effect.Ripple = Ripple;
        })(effect = material.effect || (material.effect = {}));
    })(material = Blend.material || (Blend.material = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Typings.ts" />
var Blend;
(function (Blend) {
    var dom;
    (function (dom) {
        var ElementConfigBuilder = (function () {
            function ElementConfigBuilder(config) {
                var me = this, cfg = {};
                if (Blend.isString(config)) {
                    cfg = {
                        tag: config
                    };
                }
                else {
                    cfg = config;
                }
                me.config = Blend.apply({
                    tag: "div",
                    cls: [],
                    children: [],
                    listeners: {},
                    data: {},
                    style: {},
                    selectable: null
                }, cfg, true, true);
            }
            ElementConfigBuilder.prototype.addChild = function (child) {
                var me = this;
                if (Blend.isInstanceOf(child, Blend.dom.ElementConfigBuilder)) {
                    me.config.children.push(child);
                    return child;
                }
                else {
                    var c = new Blend.dom.ElementConfigBuilder(child);
                    me.config.children.push(c);
                    return c;
                }
            };
            ElementConfigBuilder.prototype.setStyle = function (styles) {
                var me = this;
                Blend.forEach(styles, function (v, k) {
                    me.config.style[k] = v;
                });
                return this;
            };
            ElementConfigBuilder.prototype.setSelectable = function (state) {
                this.config.selectable = state;
                return this;
            };
            ElementConfigBuilder.prototype.setText = function (text) {
                this.config.text = text;
                return this;
            };
            ElementConfigBuilder.prototype.addCSS = function (css) {
                var me = this;
                css.forEach(function (itm) {
                    me.config.cls.push(itm);
                });
                return this;
            };
            ElementConfigBuilder.prototype.setOID = function (oid) {
                this.config.oid = oid;
                return this;
            };
            ElementConfigBuilder.prototype.setTag = function (tag) {
                this.config.tag = tag;
                return this;
            };
            ElementConfigBuilder.prototype.getConfig = function () {
                return this.config;
            };
            return ElementConfigBuilder;
        }());
        dom.ElementConfigBuilder = ElementConfigBuilder;
    })(dom = Blend.dom || (Blend.dom = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../material/Material.ts" />
/// <reference path="../material/effect/Ripple.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../dom/ElementConfigBuilder.ts" />
var Blend;
(function (Blend) {
    var button;
    (function (button) {
        /**
         * Base class for implementing a Button
         */
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button(config) {
                if (config === void 0) { config = {}; }
                _super.call(this, config);
                this.wrapperElement = null;
                this.textElement = null;
                this.iconElement = null;
                var me = this;
                me.buttonTypes = ["flat", "raised", "fab", "fab-mini", "round-flat", "round-raised"];
                me.fabPositions = [
                    "top-right",
                    "top-center",
                    "top-left",
                    "center-right",
                    "center-center",
                    "center-left",
                    "bottom-right",
                    "bottom-center",
                    "bottom-left",
                    "relative"
                ];
                me.iconSizes = {
                    "small": 18,
                    "medium": 24,
                    "large": 36,
                    "xlarge": 48
                };
                me.config = {
                    text: config.text || "",
                    icon: config.icon || null,
                    iconFamily: config.iconFamily || "material-icons",
                    iconAlign: me.getCheckIconAlign(config.iconAlign),
                    buttonType: me.getCheckButtonType(config.buttonType),
                    fabPosition: me.getCheckFabPosition(config.fabPosition),
                    theme: config.theme || "default",
                    disabled: config.disabled === true ? true : false,
                    iconSize: config.iconSize || null,
                    ripple: config.ripple === false ? false : true
                };
            }
            Button.prototype.setState = function (value) {
                var me = this;
                me.config.disabled = !value;
                if (value === true) {
                    me.element.removeAttribute("disabled");
                }
                else {
                    me.element.setAttribute("disabled", true);
                }
                return me;
            };
            Button.prototype.isEnabled = function () {
                return !this.config.disabled;
            };
            Button.prototype.getCheclIconSize = function (iconSize) {
                var me = this;
                iconSize = iconSize || "default";
                iconSize = iconSize.inArray(Object.keys(me.iconSizes)) ? iconSize : "default";
                return iconSize === "default" ? null : iconSize;
            };
            Button.prototype.getCheckFabPosition = function (fabPosition) {
                var me = this;
                fabPosition = fabPosition || "relative";
                fabPosition = fabPosition.inArray(me.fabPositions) ? fabPosition : "relative";
                return fabPosition === "relative" ? null : fabPosition;
            };
            Button.prototype.getCheckIconAlign = function (iconAlign) {
                iconAlign = iconAlign || "left";
                return iconAlign.inArray(["left", "right"]) ? iconAlign : "left";
            };
            Button.prototype.getCheckButtonType = function (buttonType) {
                var me = this;
                buttonType = (buttonType || "flat");
                return buttonType.inArray(me.buttonTypes) ? buttonType : "flat";
            };
            Button.prototype.setTheme = function (theme) {
                var me = this;
                me.config.theme = theme || "default";
                me.performLayout();
                return me;
            };
            Button.prototype.setButtonType = function (buttonType) {
                var me = this;
                me.config.buttonType = me.getCheckButtonType(buttonType);
                me.element.clearCssClass().addCssClass(["mb-btn"]);
                me.performLayout();
                return me;
            };
            Button.prototype.setText = function (text) {
                var me = this;
                me.config.text = text;
                me.textElement.setHtml(text);
                me.performLayout();
                return this;
            };
            Button.prototype.setIconSize = function (iconSize) {
                var me = this, sizeCss = "mb-btn-icon-size";
                me.config.iconSize = me.getCheclIconSize(iconSize);
                me.element.removeCssClassLike([sizeCss]);
                if (iconSize !== null) {
                    me.element.addCssClass([(sizeCss + "-") + me.config.iconSize]);
                    me.performLayout();
                }
                return this;
            };
            Button.prototype.setIcon = function (icon) {
                var me = this;
                me.config.icon = icon;
                me.iconElement.setHtml(icon);
                me.performLayout();
                return this;
            };
            Button.prototype.setFabPosition = function (fabPosition) {
                var me = this, posCss = "mb-" + me.config.buttonType + "-pos";
                if (me.isFab()) {
                    me.config.fabPosition = me.getCheckFabPosition(fabPosition);
                    me.element.removeCssClassLike([posCss]);
                    me.element.addCssClass([(posCss + "-") + me.config.fabPosition]);
                    me.performLayout();
                }
                return this;
            };
            Button.prototype.updateLayout = function () {
                var me = this, themeCls = "btn-theme-" + me.config.buttonType + "-" + me.config.theme, bothCls = "mb-btn-" + me.config.buttonType + "-both", textOnlyCls = "mb-btn-" + me.config.buttonType + "-text-only", iconOnlyCls = "mb-btn-" + me.config.buttonType + "-icon-only", textIconCls = "mb-btn-inner-texticon", iconTextCls = "mb-btn-inner-icontext", hasIcon = me.config.icon !== null, hasText = (me.config.text || "").trim() !== "", roundOrFabButton = me.config.buttonType.indexOf("round") !== -1 || me.config.buttonType.indexOf("fab") !== -1;
                me.element.removeCssClass([textOnlyCls, iconOnlyCls, bothCls, themeCls]);
                me.wrapperElement.removeCssClass([textIconCls, iconTextCls]);
                if (me.isFab() || me.isRound()) {
                    hasText = false;
                    if (!hasIcon) {
                        hasIcon = true;
                        me.setIcon("mood");
                    }
                    if (me.config.fabPosition && me.isFab()) {
                        me.setFabPosition(me.config.fabPosition);
                    }
                    if (me.isRound()) {
                        me.setIconSize(me.config.iconSize);
                    }
                }
                else {
                    me.setIconSize(me.config.iconSize);
                }
                if (hasText && hasIcon) {
                    me.element.addCssClass([bothCls]);
                    if (me.config.iconAlign === "left") {
                        me.wrapperElement.addCssClass(iconTextCls);
                    }
                    else if (me.config.iconAlign === "right") {
                        me.wrapperElement.addCssClass(textIconCls);
                    }
                }
                else if (hasText) {
                    me.element.addCssClass([textOnlyCls]);
                }
                else if (hasIcon) {
                    me.element.addCssClass([iconOnlyCls]);
                }
                me.element.addCssClass([themeCls]);
                me.setState(!me.config.disabled);
                if (me.config.ripple === true) {
                    me.rippleEffect = null; // remove the old one!
                    me.rippleEffect = new Blend.material.effect.Ripple({
                        element: me.element,
                        center: roundOrFabButton ? true : false,
                        color: roundOrFabButton ? me.iconElement : me.textElement
                    });
                }
            };
            Button.prototype.notifyClick = function (evt) {
                var me = this;
                me.fireEvent("click", evt);
            };
            Button.prototype.initEvents = function () {
                var me = this;
                me.element.addEventListener("click", me.notifyClick.bind(me));
            };
            /**
             * Check if this button is a Floating Action Button
             */
            Button.prototype.isFab = function () {
                return this.config.buttonType.indexOf("fab") !== -1;
            };
            /**
             * Check if this button is either a round-flat or round-raised
             */
            Button.prototype.isRound = function () {
                return this.config.buttonType.indexOf("round") !== -1;
            };
            Button.prototype.render = function () {
                var me = this;
                var buttonEl = new Blend.dom.ElementConfigBuilder("button")
                    .addCSS(["mb-btn"]);
                var innerEl = new Blend.dom.ElementConfigBuilder("span")
                    .setOID("wrapperElement")
                    .addCSS(["mb-btn-inner"]);
                var txtEl = new Blend.dom.ElementConfigBuilder("span")
                    .setOID("textElement")
                    .addCSS(["mb-btn-text"])
                    .setText(me.config.text);
                var iconEl = new Blend.dom.ElementConfigBuilder("i")
                    .setOID("iconElement")
                    .addCSS(["mb-btn-icon", me.config.iconFamily]);
                if (me.config.icon !== null) {
                    iconEl.setText(me.config.icon);
                }
                if (me.config.iconAlign === "left") {
                    innerEl.addChild(iconEl);
                    innerEl.addChild(txtEl);
                }
                if (me.config.iconAlign === "right") {
                    innerEl.addChild(txtEl);
                    innerEl.addChild(iconEl);
                }
                buttonEl.addChild(innerEl);
                return Blend.dom.Element.create(buttonEl, me.assignElementByOID, me);
            };
            return Button;
        }(Blend.material.Material));
        button.Button = Button;
    })(button = Blend.button || (Blend.button = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../material/Material.ts" />
/// <reference path="../dom/Element.ts" />
var Blend;
(function (Blend) {
    var container;
    (function (container) {
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            return Container;
        }(Blend.material.Material));
        container.Container = Container;
    })(container = Blend.container || (Blend.container = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Blend.ts" />
/// <reference path="Material.ts" />
var Blend;
(function (Blend) {
    var material;
    (function (material) {
        var Rectangle = (function (_super) {
            __extends(Rectangle, _super);
            function Rectangle(config) {
                if (config === void 0) { config = {}; }
                _super.call(this, config);
                var me = this;
                me.setBounds({
                    width: config.width || 100,
                    height: config.height || 100
                });
                me.setStyle({
                    "background-color": config.color || "transparent",
                    "border": config.border === true ? "1px solid #000" : null
                });
                me.layoutCount = 0;
            }
            Rectangle.prototype.layoutView = function () {
                var me = this;
                me.layoutCount++;
            };
            Rectangle.prototype.finalizeRender = function () {
                var me = this;
                _super.prototype.finalizeRender.call(this);
                me.addCssClass("m-rectangle");
            };
            Rectangle.prototype.log = function () {
                var me = this;
                me.element.setHtml("<pre>Layouts: " + me.layoutCount + "</pre>");
            };
            return Rectangle;
        }(Blend.material.Material));
        material.Rectangle = Rectangle;
        Blend.registerClassWithAlias("mb.rect", Blend.material.Rectangle);
    })(material = Blend.material || (Blend.material = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../Typings.ts" />
/// <reference path="../Component.ts" />
var Blend;
(function (Blend) {
    var mvc;
    (function (mvc) {
        /**
         * Provides a generic and bindable Model
         */
        var Model = (function (_super) {
            __extends(Model, _super);
            function Model(config) {
                if (config === void 0) { config = {}; }
                _super.call(this, config);
                this.data = config;
                this.createProperties();
            }
            /**
            * Sets the values of the fields in this Model. This action triggers
            * all the handlers for bound View setters
            */
            Model.prototype.setData = function (data) {
                var me = this, sname;
                Blend.forEach(data, function (value, name) {
                    sname = "set" + name.ucfirst();
                    if (me.hasFunction(sname)) {
                        me.applyFunction(sname, [value]);
                    }
                });
            };
            /**
             * Gets the current data in this Model
             */
            Model.prototype.getData = function () {
                return this.data;
            };
            /**
             * Creates automatic properties for this Model when there are no
             * custom getters/setters available
             */
            Model.prototype.createProperties = function () {
                var me = this, sname, gname;
                Blend.forEach(me.data, function (value, name) {
                    gname = "get" + name.ucfirst(),
                        sname = "set" + name.ucfirst();
                    if (!me.hasFunction(gname)) {
                        me[gname] = function () {
                            return me.data[name];
                        };
                    }
                    if (!me.hasFunction(sname)) {
                        me[sname] = function (data) {
                            me.data[name] = data;
                            return me;
                        };
                    }
                });
            };
            return Model;
        }(Blend.Component));
        mvc.Model = Model;
    })(mvc = Blend.mvc || (Blend.mvc = {}));
})(Blend || (Blend = {}));
/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../application/Application.ts" />
var Blend;
(function (Blend) {
    var web;
    (function (web) {
        /**
         * Base class for a web/desktop application
         */
        var Application = (function (_super) {
            __extends(Application, _super);
            function Application() {
                _super.apply(this, arguments);
            }
            return Application;
        }(Blend.application.Application));
        web.Application = Application;
    })(web = Blend.web || (Blend.web = {}));
})(Blend || (Blend = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxlbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9ibGVuZC9zcmMvY29tbW9uL1V0aWxzLnRzIiwiLi4vLi4vYmxlbmQvc3JjL1R5cGluZ3MudHMiLCIuLi8uLi9ibGVuZC9zcmMvYmluZGluZy9CaW5kaW5nUHJvdmlkZXIudHMiLCIuLi8uLi9ibGVuZC9zcmMvQ29tcG9uZW50LnRzIiwiLi4vLi4vYmxlbmQvc3JjL2RvbS9DbGFzc0xpc3QudHMiLCIuLi8uLi9ibGVuZC9zcmMvZG9tL1N0eWxlTGlzdC50cyIsIi4uLy4uL2JsZW5kL3NyYy9kb20vRWxlbWVudC50cyIsIi4uLy4uL2JsZW5kL3NyYy9SdW50aW1lLnRzIiwiLi4vLi4vYmxlbmQvc3JjL0JsZW5kLnRzIiwiLi4vLi4vYmxlbmQvc3JjL1ZlcnNpb24udHMiLCIuLi8uLi9ibGVuZC9zcmMvYWpheC9BamF4UmVxdWVzdC50cyIsIi4uLy4uL2JsZW5kL3NyYy9hamF4L0FqYXhHZXRSZXF1ZXN0LnRzIiwiLi4vLi4vYmxlbmQvc3JjL2FqYXgvQWpheFBvc3RSZXF1ZXN0LnRzIiwiLi4vLi4vYmxlbmQvc3JjL212Yy9DbGllbnQudHMiLCIuLi8uLi9ibGVuZC9zcmMvbXZjL1ZpZXcudHMiLCIuLi8uLi9ibGVuZC9zcmMvbXZjL0NvbnRyb2xsZXIudHMiLCIuLi8uLi9ibGVuZC9zcmMvbXZjL0NvbnRleHQudHMiLCIuLi8uLi9ibGVuZC9zcmMvbWF0ZXJpYWwvTWF0ZXJpYWwudHMiLCIuLi8uLi9ibGVuZC9zcmMvYXBwbGljYXRpb24vQXBwbGljYXRpb24udHMiLCIuLi8uLi9ibGVuZC9zcmMvbWF0ZXJpYWwvZWZmZWN0L1JpcHBsZS50cyIsIi4uLy4uL2JsZW5kL3NyYy9kb20vRWxlbWVudENvbmZpZ0J1aWxkZXIudHMiLCIuLi8uLi9ibGVuZC9zcmMvYnV0dG9uL0J1dHRvbi50cyIsIi4uLy4uL2JsZW5kL3NyYy9jb250YWluZXIvQ29udGFpbmVyLnRzIiwiLi4vLi4vYmxlbmQvc3JjL2xvZ2dlci9Mb2dnZXJJbnRlcmZhY2UudHMiLCIuLi8uLi9ibGVuZC9zcmMvbWF0ZXJpYWwvUmVjdGFuZ2xlLnRzIiwiLi4vLi4vYmxlbmQvc3JjL212Yy9Nb2RlbC50cyIsIi4uLy4uL2JsZW5kL3NyYy93ZWIvQXBwbGljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQXFCSCxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUN6Qzs7T0FFRztJQUNILGNBQWMsQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFVBQVMsS0FBSztRQUNsRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RCxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNsRCxDQUFDO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDNUIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUc7UUFDdkIsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxTQUFTLENBQUM7UUFDaEMsVUFBVSxDQUFDO1lBQ1AsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ1YsQ0FBQyxDQUFDO0FB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LFNBQVMsR0F5RHpDO1FBekRZLFNBQUssUUF5RGpCLENBQUE7SUFFTCxDQUFDLEVBaEVlLEdBQUcsR0FBSCxTQUFHLEtBQUgsU0FBRyxRQWdFbEI7QUFBRCxDQUFDLEVBaEVTLEtBQUssS0FBTCxLQUFLLFFBZ0VkO0FDbkZEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBRUgsc0RBQXNEO0FBRXRELElBQVUsS0FBSyxDQU1kO0FBTkQsV0FBVSxLQUFLO0lBQUMsSUFBQSxHQUFHLENBTWxCO0lBTmUsV0FBQSxHQUFHLEVBQUMsQ0FBQztRQUNqQjs7V0FFRztRQUNIO1lBQWlDLCtCQUE2QjtZQUE5RDtnQkFBaUMsOEJBQTZCO1lBQzlELENBQUM7WUFBRCxrQkFBQztRQUFELENBQUMsQUFERCxDQUFpQyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FDN0Q7UUFEWSxlQUFXLGNBQ3ZCLENBQUE7SUFDTCxDQUFDLEVBTmUsR0FBRyxHQUFILFNBQUcsS0FBSCxTQUFHLFFBTWxCO0FBQUQsQ0FBQyxFQU5TLEtBQUssS0FBTCxLQUFLLFFBTWQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE2IFRydWVTb2Z0d2FyZSBCLlYuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbnRlcmZhY2UgQXJyYXk8VD4ge1xuICAgIHVuaXF1ZSgpOiBBcnJheTxUPjtcbn1cblxuaW50ZXJmYWNlIFN0cmluZyB7XG4gICAgdWNmaXJzdCgpOiBzdHJpbmc7XG4gICAgcmVwZWF0KGNvdW50czogbnVtYmVyKTogc3RyaW5nO1xuICAgIHN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKTogYm9vbGVhbjtcbiAgICBpbkFycmF5KGxpc3Q6IEFycmF5PHN0cmluZz4pOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgRnVuY3Rpb24ge1xuICAgIGFzeW5jOiBhbnk7XG59XG5cbmludGVyZmFjZSBYTUxIdHRwUmVxdWVzdCB7XG4gICAgc2VuZEFzQmluYXJ5KGRhdGE6IGFueSk6IHZvaWQ7XG59XG5cbmlmICghWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmRBc0JpbmFyeSkge1xuICAgIC8qKlxuICAgICAqIEZyb20gTUROXG4gICAgICovXG4gICAgWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmRBc0JpbmFyeSA9IGZ1bmN0aW9uKHNEYXRhKSB7XG4gICAgICAgIHZhciBuQnl0ZXMgPSBzRGF0YS5sZW5ndGgsIHVpOERhdGEgPSBuZXcgVWludDhBcnJheShuQnl0ZXMpO1xuICAgICAgICBmb3IgKHZhciBuSWR4ID0gMDsgbklkeCA8IG5CeXRlczsgbklkeCsrKSB7XG4gICAgICAgICAgICB1aThEYXRhW25JZHhdID0gc0RhdGEuY2hhckNvZGVBdChuSWR4KSAmIDB4ZmY7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZW5kKHVpOERhdGEpO1xuICAgIH07XG59XG5cbmlmICghRnVuY3Rpb24ucHJvdG90eXBlLmFzeW5jKSB7XG4gICAgRnVuY3Rpb24ucHJvdG90eXBlLmFzeW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtZS5hcHBseShtZSwgYXJncyk7XG4gICAgICAgIH0sIDEpO1xuICAgIH07XG59XG5cbmlmICghU3RyaW5nLnByb3RvdHlwZS5pbkFycmF5KSB7XG4gICAgU3RyaW5nLnByb3RvdHlwZS5pbkFycmF5ID0gZnVuY3Rpb24obGlzdDogQXJyYXk8c3RyaW5nPiA9IFtdKTogYm9vbGVhbiB7XG4gICAgICAgIHZhciByZXN1bHQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChsaXN0W2ldID09PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5cbmlmICghU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQpIHtcbiAgICBTdHJpbmcucHJvdG90eXBlLnJlcGVhdCA9IGZ1bmN0aW9uKGNvdW50czogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXkoY291bnRzICsgMSkuam9pbih0aGlzKTtcbiAgICB9O1xufVxuXG5pZiAoIVN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCkge1xuICAgIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHNlYXJjaFN0cmluZzogc3RyaW5nLCBwb3NpdGlvbjogbnVtYmVyID0gMCkge1xuICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnN0cihwb3NpdGlvbiwgc2VhcmNoU3RyaW5nLmxlbmd0aCkgPT09IHNlYXJjaFN0cmluZztcbiAgICB9O1xufVxuXG5pZiAoIVN0cmluZy5wcm90b3R5cGUudWNmaXJzdCkge1xuICAgIFN0cmluZy5wcm90b3R5cGUudWNmaXJzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRoaXMuc2xpY2UoMSk7XG4gICAgfTtcbn1cblxuaWYgKCFTdHJpbmcucHJvdG90eXBlLnRyaW0pIHtcbiAgICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csIFwiXCIpO1xuICAgIH07XG59XG5cbmlmICghKDxhbnk+QXJyYXkucHJvdG90eXBlKS51bmlxdWUpIHtcbiAgICAoPGFueT5BcnJheS5wcm90b3R5cGUpLnVuaXF1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXIoZnVuY3Rpb24oaXRlbTogYW55LCBpOiBhbnksIGFsbEl0ZW1zOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiBpID09PSBhbGxJdGVtcy5pbmRleE9mKGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgVHJ1ZVNvZnR3YXJlIEIuVi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25maWd1cmluZyBhIGRpY3Rpb2FueVxuICovXG5pbnRlcmZhY2UgRGljdGlvbmFyeUludGVyZmFjZSB7XG4gICAgW25hbWU6IHN0cmluZ106IGFueTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNvbmZpZ3VyaW5nIFN0eWxlc1xuICovXG5pbnRlcmZhY2UgU3R5bGVJbnRlcmZhY2Uge1xuICAgIFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXI7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBhc3NpZ25pbmcgRXZlbnRMaXN0ZW5lcnMgdG8gRE9NIEVsZW1lbnRzXG4gKi9cbmludGVyZmFjZSBDcmVhdGVFbGVtZW50RXZlbnRMaXN0ZW5lcnNJbnRlcmZhY2Uge1xuICAgIFtuYW1lOiBzdHJpbmddOiBFdmVudExpc3RlbmVyO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgY29uZmlndXJpbmcgdGhlIERvbS5jcmVhdGVFbGVtZW50IHV0aWxpdHlcbiAqL1xuaW50ZXJmYWNlIENyZWF0ZUVsZW1lbnRJbnRlcmZhY2Uge1xuICAgIHRhZz86IHN0cmluZztcbiAgICBzY29wZT86IGFueTtcbiAgICBvaWQ/OiBzdHJpbmc7XG4gICAgY2xzPzogc3RyaW5nIHwgQXJyYXk8c3RyaW5nPjtcbiAgICBsaXN0ZW5lcnM/OiBDcmVhdGVFbGVtZW50RXZlbnRMaXN0ZW5lcnNJbnRlcmZhY2U7XG4gICAgdGV4dD86IHN0cmluZztcbiAgICBjaGlsZHJlbj86IEFycmF5PENyZWF0ZUVsZW1lbnRJbnRlcmZhY2UgfCBIVE1MRWxlbWVudCB8IEJsZW5kLmRvbS5FbGVtZW50PjtcbiAgICBkYXRhPzogYW55O1xuICAgIHN0eWxlPzogU3R5bGVJbnRlcmZhY2U7XG4gICAgc2VsZWN0YWJsZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogIEludGVyZmFjZSBmb3IgY29uZmlndXJpbmcgYSBDb21wb25lbnRcbiAqL1xuaW50ZXJmYWNlIEJpbmRhYmxlSW50ZXJmYWNlIHtcbiAgICBoYXNGdW5jdGlvbihmbmFtZTogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBhcHBseUZ1bmN0aW9uKG5hbWU6IHN0cmluZywgYXJnczogQXJyYXk8YW55PiB8IElBcmd1bWVudHMpOiBhbnk7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25maWd1cmluZyBhIEJsZW5kLkNvbXBvbmVudCBjbGFzc1xuICovXG5pbnRlcmZhY2UgQ29tcG9uZW50Q2xhc3Mge1xuICAgIG5ldyAoY29uZmlnPzogYW55KTogQmxlbmQuQ29tcG9uZW50O1xufVxuXG4vKipcbiAqIENsYXNzIHJlZ2lzdGVyeSBpdGVtIGludGVyZmFjZVxuICovXG5pbnRlcmZhY2UgQ2xhc3NSZWdpc3RyeUludGVyZmFjZSB7XG4gICAgW25hbWU6IHN0cmluZ106IENvbXBvbmVudENsYXNzO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgY29uZmlndXJpbmcgYSBDb21wb25lbnQgdXNpbmcgSlNPTiBjb25maWcgbm90YXRpb25cbiAqIHdpdGggYSBjb25maWcgdHlwZSBjdHlwZVxuICovXG5pbnRlcmZhY2UgQ29tcG9uZW50Q29uZmlnIHtcbiAgICBjdHlwZT86IENvbXBvbmVudFR5cGVzO1xuICAgIFtuYW1lOiBzdHJpbmddOiBhbnk7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25maWd1cmluZyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBjb250cm9sbGVyXG4gKi9cbmludGVyZmFjZSBGdW5jdGlvbkFzQ29udHJvbGxlciB7XG4gICAgKGNsaWVudDogQmxlbmQubXZjLkNsaWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogdm9pZDtcbn1cbi8qKlxuICogQ3VzdG9tIHR5cGUgZGVzY3JpYmluZyBhIGN0eXBlXG4gKi9cbnR5cGUgQ29tcG9uZW50VHlwZXMgPSBDb21wb25lbnRDbGFzcyB8IENvbXBvbmVudENvbmZpZyB8IHN0cmluZztcbnR5cGUgQ29udHJvbGxlclR5cGUgPSBDb21wb25lbnRDbGFzcyB8IEJsZW5kLm12Yy5Db250cm9sbGVyIHwgRnVuY3Rpb25Bc0NvbnRyb2xsZXIgfCBzdHJpbmc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25maWd1cmluZyBhIE1WQyBDbGllbnQgKFVzZWQgYnkgTWF0ZXJpYWwgYW5kIENvbnRleHQpXG4gKi9cbmludGVyZmFjZSBNdmNDbGllbnRJbnRlcmZhY2Uge1xuICAgIGNvbnRyb2xsZXI/OiBDb250cm9sbGVyVHlwZSB8IEFycmF5PENvbnRyb2xsZXJUeXBlPjtcbiAgICBjb250ZXh0PzogQmxlbmQubXZjLkNvbnRleHQ7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25maWd1cmluZyBhIE1WQyBWaWV3XG4gKi9cbmludGVyZmFjZSBNdmNWaWV3SW50ZXJmYWNlIGV4dGVuZHMgTXZjQ2xpZW50SW50ZXJmYWNlIHtcbiAgICByZWZlcmVuY2U/OiBzdHJpbmc7XG4gICAgW25hbWU6IHN0cmluZ106IGFueTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNvbmZpZ3VyaW5nIGEgTWF0ZXJpYWwncyBib3VuZHMgYW5kIHZpc2liaWxpdHlcbiAqL1xuaW50ZXJmYWNlIEVsZW1lbnRCb3VuZHNJbnRlcmZhY2Uge1xuICAgIHRvcD86IG51bWJlcjtcbiAgICBsZWZ0PzogbnVtYmVyO1xuICAgIHdpZHRoPzogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhlaWdodD86IG51bWJlciB8IHN0cmluZztcbiAgICB2aXNpYmxlPzogYm9vbGVhbjtcbn1cblxuXG5pbnRlcmZhY2UgTWVkaWFRdWVyeUNvbmZpZyBleHRlbmRzIERpY3Rpb25hcnlJbnRlcmZhY2Uge1xuICAgIFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfCBBcnJheTxzdHJpbmc+O1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgY29uZmlndXJpbmcgYW4gQWpheCAoUG9zdC9HZXQpIHF1ZXJ5XG4gKi9cbmludGVyZmFjZSBBamF4UmVxdWVzdEludGVyZmFjZSB7XG4gICAgdXJsOiBzdHJpbmc7XG4gICAgaGVhZGVycz86IERpY3Rpb25hcnlJbnRlcmZhY2U7XG4gICAgb25TdGFydD86IEZ1bmN0aW9uO1xuICAgIG9uUHJvZ3Jlc3M/OiBGdW5jdGlvbjtcbiAgICBvblByZXBhcmVVcGxvYWQ/OiBGdW5jdGlvbjtcbiAgICBvbkNvbXBsZXRlPzogRnVuY3Rpb247XG4gICAgb25TdWNjZXNzPzogRnVuY3Rpb247XG4gICAgb25GYWlsZWQ/OiBGdW5jdGlvbjtcbiAgICBzY29wZT86IGFueTtcbiAgICB3aXRoQ3JlZGVudGlhbHM/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgY29uZmlndXJpbmcgdGhlIHBhZGRpbmcgb2YgYW4gRWxlbWVudFxuICovXG5pbnRlcmZhY2UgUGFkZGluZ0ludGVyZmFjZSB7XG4gICAgdG9wPzogbnVtYmVyO1xuICAgIHJpZ2h0PzogbnVtYmVyO1xuICAgIGJvdHRvbT86IG51bWJlcjtcbiAgICBsZWZ0PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIE1hdGVyaWFsIFR5cGVzIGRlZmluaXRpb25cbiAqL1xudHlwZSBNYXRlcmlhbFR5cGUgPSBzdHJpbmcgfCBDb21wb25lbnRDbGFzcyB8IE1hdGVyaWFsSW50ZXJmYWNlIHwgQ29udGFpbmVyTWF0ZXJpYWxJbnRlcmZhY2UgfCBCbGVuZC5tYXRlcmlhbC5NYXRlcmlhbDtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNvbmZpZ3VyaW5nIGEgTWF0ZXJpYWxcbiAqL1xuaW50ZXJmYWNlIE1hdGVyaWFsSW50ZXJmYWNlIGV4dGVuZHMgTXZjVmlld0ludGVyZmFjZSB7XG4gICAgcGFyZW50PzogQmxlbmQubWF0ZXJpYWwuTWF0ZXJpYWw7XG4gICAgdXNlUGFyZW50Q29udHJvbGxlcj86IGJvb2xlYW47XG4gICAgY3NzPzogc3RyaW5nIHwgQXJyYXk8c3RyaW5nPjtcbiAgICBzdHlsZT86IFN0eWxlSW50ZXJmYWNlO1xuICAgIHZpc2libGU/OiBib29sZWFuO1xuICAgIHRvcD86IG51bWJlcjtcbiAgICBsZWZ0PzogbnVtYmVyO1xuICAgIHdpZHRoPzogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhlaWdodD86IG51bWJlciB8IHN0cmluZztcbiAgICByZXNwb25zaXZlPzogYm9vbGVhbjtcbiAgICByZXNwb25zZVRvPzogTWVkaWFRdWVyeUNvbmZpZztcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNvbmZpZ3VyaW5nIGEgQ29udGFpbmVyXG4gKi9cbmludGVyZmFjZSBDb250YWluZXJNYXRlcmlhbEludGVyZmFjZSBleHRlbmRzIE1hdGVyaWFsSW50ZXJmYWNlIHtcbiAgICBpdGVtcz86IEFycmF5PE1hdGVyaWFsVHlwZT47XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25maWd1cmluZyBhbiBBcHBsaWNhdGlvblxuICovXG5pbnRlcmZhY2UgQXBwbGljYXRpb25JbnRlcmZhY2UgZXh0ZW5kcyBNYXRlcmlhbEludGVyZmFjZSB7XG4gICAgbWFpblZpZXc/OiBNYXRlcmlhbFR5cGU7XG4gICAgdGhlbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25maWd1cmluZyBhIEJ1dHRvblxuICovXG5pbnRlcmZhY2UgQnV0dG9uSW50ZXJmYWNlIGV4dGVuZHMgTWF0ZXJpYWxJbnRlcmZhY2Uge1xuICAgIGljb24/OiBzdHJpbmc7XG4gICAgaWNvblNpemU/OiBzdHJpbmc7XG4gICAgaWNvbkZhbWlseT86IHN0cmluZztcbiAgICB0aGVtZT86IHN0cmluZztcbiAgICBkaXNhYmxlZD86IGJvb2xlYW47XG4gICAgcmlwcGxlPzogYm9vbGVhbjtcbiAgICB0ZXh0Pzogc3RyaW5nO1xuICAgIGljb25BbGlnbj86IHN0cmluZztcbiAgICBidXR0b25UeXBlPzogc3RyaW5nO1xuICAgIGZhYlBvc2l0aW9uPzogc3RyaW5nO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1R5cGluZ3MudHNcIiAvPlxuXG5uYW1lc3BhY2UgQmxlbmQuYmluZGluZyB7XG5cbiAgICAvKipcbiAgICAgKiBQcm92aWRlcyBzaWduYWwvc2xvdCBzdHlsZSBvYmplY3QgYmluZGluZy5cbiAgICAgKiBUaGUgbWFwcGluZyBjYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgc3R5bGVzXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIEJpbmRpbmdQcm92aWRlciB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJpbmRzIHRoZSBwcm9wZXJ0eXMgb2YgdHdvIGNvbXBvbmVudHMgdXNpbmcgc2V0U291cmNlL2dldFNvdXJjZS9zZXRUYXJnZXQgbWV0aG9kXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgYmluZFByb3BlcnR5KHNvdXJjZTogQmluZGFibGVJbnRlcmZhY2UsIHRhcmdldDogQmluZGFibGVJbnRlcmZhY2UsIHNyY1Byb3A6IHN0cmluZywgdHJnUHJvcDogc3RyaW5nID0gbnVsbCkge1xuICAgICAgICAgICAgdHJnUHJvcCA9IHRyZ1Byb3AgfHwgc3JjUHJvcDtcbiAgICAgICAgICAgIHRoaXMuYmluZChzb3VyY2UsIHRhcmdldCwgXCJzZXRcIiArIHNyY1Byb3AudWNmaXJzdCgpLCBcInNldFwiICsgdHJnUHJvcC51Y2ZpcnN0KCksIFwiZ2V0XCIgKyBzcmNQcm9wLnVjZmlyc3QoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYmluZChcbiAgICAgICAgICAgIHNvdXJjZTogQmluZGFibGVJbnRlcmZhY2UsXG4gICAgICAgICAgICB0YXJnZXQ6IEJpbmRhYmxlSW50ZXJmYWNlLFxuICAgICAgICAgICAgc291cmNlTWVtYmVyOiBzdHJpbmcsXG4gICAgICAgICAgICB0YXJnZXRNZW1iZXI6IHN0cmluZyxcbiAgICAgICAgICAgIHVzaW5nTWVtYmVyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBvcmdTb3VyY2VNZW1iZXIgPSAoPGFueT5zb3VyY2UpW3NvdXJjZU1lbWJlcl07XG4gICAgICAgICAgICAoPGFueT5zb3VyY2UpW3NvdXJjZU1lbWJlcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3IgPSBvcmdTb3VyY2VNZW1iZXIuYXBwbHkoc291cmNlLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5hcHBseUZ1bmN0aW9uKHRhcmdldE1lbWJlclxuICAgICAgICAgICAgICAgICAgICAsIFt1c2luZ01lbWJlciAhPT0gbnVsbCA/IHNvdXJjZS5hcHBseUZ1bmN0aW9uKHVzaW5nTWVtYmVyLCBbc3JdKSA6IHNyXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNyO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgVHJ1ZVNvZnR3YXJlIEIuVi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJUeXBpbmdzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJCbGVuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmluZGluZy9CaW5kaW5nUHJvdmlkZXIudHNcIiAvPlxuXG5uYW1lc3BhY2UgQmxlbmQge1xuXG4gICAgLyoqXG4gICAgICogQmFzZSBjbGFzcyBmb3IgYSBjb21wb25lbnQgaW4gQmxlbmRcbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgQ29tcG9uZW50IGltcGxlbWVudHMgQmluZGFibGVJbnRlcmZhY2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogRGljdGlvbmFyeUludGVyZmFjZSA9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIHBlcnBlcnR5IG9mIHRoaXMgY29tcG9uZW50LiBUaGlzIGlzIHVzZWQgdG9cbiAgICAgICAgICogUmVhZCB0aGUgcHJpdmF0ZS1pc2ggdmFsdWUgb2YgYSBjb21wb25lbnRcbiAgICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZ2V0UHJvcGVydHk8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGwpOiBUIHtcbiAgICAgICAgICAgIHZhciBtZTogYW55ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiAobWVbbmFtZV0gPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWx1ZSA6IG1lW25hbWVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcm92aWRlcyBhIHdheSB0byBleHRlcm5hbGx5IHNldCBhIHByb3BlcnR5IG9uIHRoaXMgY29tcG9uZW50XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc2V0UHJvcGVydHkobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgICAgICB2YXIgbWU6IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBtZVtuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIHRoaXMgQ29tcG9uZW50IGltcGxlbWVudHMgYSBmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGhhc0Z1bmN0aW9uKGZuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBtZTogYW55ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiAhQmxlbmQuaXNOdWxsT3JVbmRlZihtZVtmbmFtZV0pICYmIEJsZW5kLmlzRnVuY3Rpb24obWVbZm5hbWVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEeW5hbWljYWxseSBydW4gYSBmdW5jdGlvbiB3aXRoaW4gdGhpcyBDb21wb25lbnRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBhcHBseUZ1bmN0aW9uKG5hbWU6IHN0cmluZywgYXJnczogQXJyYXk8YW55PiB8IElBcmd1bWVudHMpOiBhbnkge1xuICAgICAgICAgICAgdmFyIG1lOiBhbnkgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGZuOiBGdW5jdGlvbiA9IDxGdW5jdGlvbj5tZVtuYW1lXTtcbiAgICAgICAgICAgIGlmIChCbGVuZC5pc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShtZSwgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2xhc3MgbWV0aG9kIFske25hbWV9XSBkb2VzIG5vdCBleGlzdCFgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgVHJ1ZVNvZnR3YXJlIEIuVi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbm5hbWVzcGFjZSBCbGVuZC5kb20ge1xuICAgIC8qKlxuICAgICAqIEltcGxlbWVudHMgYSBjbGFzc0xpc3QgcHJvdmlkZXIgZm9yIHRoZSBCbGVuZC5kb20uRWxlbWVudFxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBDbGFzc0xpc3Qge1xuXG4gICAgICAgIHByb3RlY3RlZCBsaXN0OiBBcnJheTxzdHJpbmc+O1xuXG4gICAgICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihodG1sRWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5saXN0ID0gW107XG4gICAgICAgICAgICBtZS5pbml0TGlzdCgoaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIikudHJpbSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaW5pdExpc3QoY3NzOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICAoY3NzID09PSBcIlwiID8gW10gOiBjc3Muc3BsaXQoXCIgXCIpKS5mb3JFYWNoKGZ1bmN0aW9uKGM6IHN0cmluZykge1xuICAgICAgICAgICAgICAgIGMgPSBjLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoYy5sZW5ndGggIT09IDAgJiYgYyAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBtZS5saXN0LnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2VyaWFsaXplVG8oaHRtbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGNzcyA9IG1lLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoY3NzICE9PSBudWxsICYmIGNzcyAhPT0gXCJcIiAmJiBjc3MubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaHRtbEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgY3NzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaHRtbEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlTGlrZShsaXN0OiBBcnJheTxzdHJpbmc+KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLCBpID0gLTEsIG46IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbihyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBtZS5saXN0LmZvckVhY2goZnVuY3Rpb24oaTogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaS5zdGFydHNXaXRoKHIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWUubGlzdCA9IG47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcmVtb3ZlKGxpc3Q6IEFycmF5PHN0cmluZz4pIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsIGkgPSAtMTtcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbihyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBpID0gbWUubGlzdC5pbmRleE9mKHIpO1xuICAgICAgICAgICAgICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBtZS5saXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGQobGlzdDogQXJyYXk8c3RyaW5nPikge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbihpOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1lLmhhcyhpKSkge1xuICAgICAgICAgICAgICAgICAgICBtZS5saXN0LnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY2xlYXIoKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXMobjogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0LmluZGV4T2YobikgIT09IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgICAgICB2YXIgciA9IHRoaXMubGlzdC5qb2luKFwiIFwiKS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gciA9PT0gXCJcIiA/IG51bGwgOiByO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHRvQXJyYXkoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0O1xuICAgICAgICB9XG4gICAgfVxufSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgVHJ1ZVNvZnR3YXJlIEIuVi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbm5hbWVzcGFjZSBCbGVuZC5kb20ge1xuXG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50cyBhIHN0eWxlIGxpc3QgcHJvdmlkZXMgZm9yIHRoZSBCbGVuZC5kb20uRWxlbWVudFxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBTdHlsZUxpc3Qge1xuXG4gICAgICAgIHByaXZhdGUgc3R5bGVzOiBEaWN0aW9uYXJ5SW50ZXJmYWNlO1xuICAgICAgICBwcml2YXRlIGVsOiBIVE1MRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBwaXhlbFJlID0gL3B4JC87XG4gICAgICAgIHByaXZhdGUgVU5JVDogc3RyaW5nID0gXCJweFwiO1xuICAgICAgICBwcml2YXRlIHVuaXRQcm9wZXJ0eVJlOiBSZWdFeHAgPSAvKHdpZHRoJHxoZWlnaHQkfHNpemUkfHJhZGl1cyR8cGFkZGluZ3xtYXJnaW4kfHRvcCR8Ym90dG9tJHxyaWdodCR8bGVmdCQpLztcbiAgICAgICAgcHJpdmF0ZSB1bml0VHlwZVJlOiBSZWdFeHAgPSAvKGVtJHxcXCUkfGF1dG98XmNhbGMpLztcblxuICAgICAgICBjb25zdHJ1Y3RvcihlbDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdExpc3QoZWwuc3R5bGUuY3NzVGV4dC50cmltKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBpbml0TGlzdChkYXRhOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsXG4gICAgICAgICAgICAgICAgcDogQXJyYXk8c3RyaW5nPjtcbiAgICAgICAgICAgIG1lLnN0eWxlcyA9IHt9O1xuICAgICAgICAgICAgaWYgKGRhdGEgIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnNwbGl0KFwiO1wiKS5mb3JFYWNoKGZ1bmN0aW9uKGQ6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZCAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcCA9IGQuc3BsaXQoXCI6XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWUuc3R5bGVzW3BbMF0udHJpbSgpXSA9IG1lLmZyb21Vbml0KHBbMV0udHJpbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVzW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdW5zZXQobmFtZTogc3RyaW5nKSB7XG4gICAgICAgICAgICBkZWxldGUgKHRoaXMuc3R5bGVzW25hbWVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb21wdXRlZChlbDogSFRNTEVsZW1lbnQsIG5hbWVzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGNzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwsIG51bGwpLFxuICAgICAgICAgICAgICAgIHI6IFN0eWxlSW50ZXJmYWNlID0ge307XG4gICAgICAgICAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKGtleTogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgcltrZXldID0gbWUuZnJvbVVuaXQoY3MuZ2V0UHJvcGVydHlWYWx1ZShrZXkpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2VyaWFsaXplVG8oZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLCBzdHlsZSA9IFwiXCI7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhtZS5zdHlsZXMpLmZvckVhY2goZnVuY3Rpb24obmFtZTogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYCR7bmFtZX06JHttZS50b1VuaXQobmFtZSwgbWUuc3R5bGVzW25hbWVdKX07YDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHN0eWxlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyBhbmQgY29udmVydHMgdGhlIHZhbHVlIHRvIHB4IGJhc2VkIG9uIHRoZSBnaXZlbiBrZXlcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgdG9Vbml0KGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIG1lLnVuaXRQcm9wZXJ0eVJlLnRlc3Qoa2V5KSAmJiAhbWUudW5pdFR5cGVSZS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBtZS5VTklUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdpdmVuIHRoZSB2YWx1ZSBpdCBjb252ZXJ0cyBweCB2YWx1ZSB0byBhIG51bWJlciwgb3RoZXJ3aXNlIGl0IHJldHVybnMgdGhlIG9yaWdpbmFsXG4gICAgICAgICAqIHZhbHVlLlxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSBmcm9tVW5pdCh2YWx1ZTogYW55KTogYW55IHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgbWUucGl4ZWxSZS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZS5yZXBsYWNlKG1lLlVOSVQsIFwiXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1R5cGluZ3MudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0NvbXBvbmVudC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xhc3NMaXN0LnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTdHlsZUxpc3QudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0JsZW5kLnRzXCIgLz5cblxubmFtZXNwYWNlIEJsZW5kLmRvbSB7XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcyBhbiBIVE1MRWxlbWVudCBpbnRvIGEgdXRpbGl0eSBjbGFzcyBmb3IgZWFzaWVyICBtYW5pcHVsYXRpb25cbiAgICAgKiBhbmQgaGFkbGluZ1xuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIGVsOiBIVE1MRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBwaXhlbFJlID0gL3B4JC87XG4gICAgICAgIHByaXZhdGUgVU5JVDogc3RyaW5nID0gXCJweFwiO1xuICAgICAgICBwcml2YXRlIHVuaXRQcm9wZXJ0eVJlOiBSZWdFeHAgPSAvKHdpZHRoJHxoZWlnaHQkfHNpemUkfHJhZGl1cyR8cGFkZGluZ3xtYXJnaW4kfHRvcCR8Ym90dG9tJHxyaWdodCR8bGVmdCQpLztcbiAgICAgICAgcHJpdmF0ZSB1bml0VHlwZVJlOiBSZWdFeHAgPSAvKGVtJHxcXCUkfGF1dG98XmNhbGMpLztcbiAgICAgICAgcHVibGljIGNsYXNzTGlzdDogQmxlbmQuZG9tLkNsYXNzTGlzdDtcbiAgICAgICAgcHVibGljIHN0eWxlTGlzdDogQmxlbmQuZG9tLlN0eWxlTGlzdDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlbDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdCA9IG5ldyBCbGVuZC5kb20uQ2xhc3NMaXN0KHRoaXMuZWwpO1xuICAgICAgICAgICAgdGhpcy5zdHlsZUxpc3QgPSBuZXcgQmxlbmQuZG9tLlN0eWxlTGlzdCh0aGlzLmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIGFuIGF0dHJpYnV0ZSB0byB0aGlzIGVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzZXRBdHRyaWJ1dGUobmFtZTogc3RyaW5nLCB2YWx1ZT86IGFueSk6IEJsZW5kLmRvbS5FbGVtZW50IHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5lbC5zZXRBdHRyaWJ1dGUuYXBwbHkobWUuZWwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gbWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVkIGFuIGF0dHJpYnV0ZSBmcm9tIHRoaXMgZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHJlbW92ZUF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBCbGVuZC5kb20uRWxlbWVudCB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUuZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIG1lO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgbGlzdCBvZiBmaWxlcyBmb3IgZnJvbSB0aGlzIEVsZW1lbnRcbiAgICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZ2V0RmlsZXMoKTogRmlsZUxpc3Qge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcywgZmVsOiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+bWUuZWw7XG4gICAgICAgICAgICBpZiAoZmVsLmZpbGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZlbC5maWxlcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWxlTGlzdCgpOyAvLyByZXR1cm4gYW4gZW1wdHkgb25lXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkcyBhbiBFdmVudExpc3RlbmVyIHRvIGFuIEV2ZW50VGFyZ2V0XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWU6IHN0cmluZywgZXZlbnRIYW5kbGVyOiBFdmVudExpc3RlbmVyKTogdm9pZCB7XG4gICAgICAgICAgICBCbGVuZC5SdW50aW1lLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5lbCwgZXZlbnROYW1lLCBldmVudEhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgYW4gRXZlbnRMaXN0ZW5lciBmcm9tIGFuIEV2ZW50VGFyZ2V0XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgcmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWU6IHN0cmluZywgZXZlbnRIYW5kbGVyOiBFdmVudExpc3RlbmVyKTogdm9pZCB7XG4gICAgICAgICAgICBCbGVuZC5SdW50aW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5lbCwgZXZlbnROYW1lLCBldmVudEhhbmRsZXIpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dW5zIHRoZSBjb21wdXRlZCBib3VuZHNcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRCb3VuZHMoKTogRWxlbWVudEJvdW5kc0ludGVyZmFjZSB7XG4gICAgICAgICAgICB2YXIgYm91bmRzOiBFbGVtZW50Qm91bmRzSW50ZXJmYWNlID0gdGhpcy5nZXRTdHlsZShbXCJ0b3BcIiwgXCJsZWZ0XCIsIFwid2lkdGhcIiwgXCJoZWlnaHRcIiwgXCJ2aXNpYmxlXCJdKSxcbiAgICAgICAgICAgICAgICBib3JkZXJTaXplOiBTdHlsZUludGVyZmFjZTtcblxuICAgICAgICAgICAgaWYgKEJsZW5kLlJ1bnRpbWUuSUUgJiYgQmxlbmQuUnVudGltZS5JRVZlcnNpb24gPCAxMikge1xuICAgICAgICAgICAgICAgIGJvcmRlclNpemUgPSB0aGlzLmdldFN0eWxlKFtcImJvcmRlci10b3Atd2lkdGhcIiwgXCJib3JkZXItcmlnaHQtd2lkdGhcIiwgXCJib3JkZXItYm90dG9tLXdpZHRoXCIsIFwiYm9yZGVyLWxlZnQtd2lkdGhcIl0pO1xuICAgICAgICAgICAgICAgIGJvdW5kcy53aWR0aCArPSA8YW55PmJvcmRlclNpemVbXCJib3JkZXItbGVmdC13aWR0aFwiXSArIDxhbnk+Ym9yZGVyU2l6ZVtcImJvcmRlci1yaWdodC13aWR0aFwiXTtcbiAgICAgICAgICAgICAgICBib3VuZHMuaGVpZ2h0ICs9IDxhbnk+Ym9yZGVyU2l6ZVtcImJvcmRlci10b3Atd2lkdGhcIl0gKyA8YW55PmJvcmRlclNpemVbXCJib3JkZXItYm90dG9tLXdpZHRoXCJdO1xuICAgICAgICAgICAgICAgIHJldHVybiBib3VuZHM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBib3VuZHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgc3R5bGUgb2YgdGhpcyBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc2V0U3R5bGUoc3R5bGVzOiBTdHlsZUludGVyZmFjZSk6IEJsZW5kLmRvbS5FbGVtZW50IHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoc3R5bGVzKSB7XG4gICAgICAgICAgICAgICAgQmxlbmQuZm9yRWFjaChzdHlsZXMsIGZ1bmN0aW9uKHY6IGFueSwgazogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2ID09PSBudWxsIHx8ICg8c3RyaW5nPnYpID09PSBcImF1dG9cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWUuc3R5bGVMaXN0LnVuc2V0KGspO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWUuc3R5bGVMaXN0LnNldChrLCB2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1lLnN0eWxlTGlzdC5zZXJpYWxpemVUbyhtZS5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIHRoZSBjb21wdXRlZCBzdHlsZXMgb2YgZW4gZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGdldFN0eWxlKHN0eWxlczogc3RyaW5nIHwgQXJyYXk8c3RyaW5nPik6IFN0eWxlSW50ZXJmYWNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0eWxlTGlzdC5nZXRDb21wdXRlZCh0aGlzLmVsLFxuICAgICAgICAgICAgICAgIEJsZW5kLndyYXBJbkFycmF5PHN0cmluZz4oc3R5bGVzKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgQ1NTIGNsYXNzZXMgZnJvbSB0aGlzIGVsZW1lbnQgaWYgcG9zc2libGVcbiAgICAgICAgICogQHJldHVybiBzdHJpbmd8c3RyaW5nW11cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRDc3NDbGFzcyhhc0FycmF5OiBib29sZWFuID0gZmFsc2UpOiAoc3RyaW5nIHwgQXJyYXk8c3RyaW5nPikge1xuICAgICAgICAgICAgcmV0dXJuIGFzQXJyYXkgPT09IHRydWUgPyB0aGlzLmNsYXNzTGlzdC50b0FycmF5KCkgOiB0aGlzLmNsYXNzTGlzdC50b1N0cmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyB3aGV0aGVyIHRoaXMgZWxlbWVudCBoYXMgYSBnaXZlbiBDU1MgY2xhc3NcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBoYXNDc3NDbGFzcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5oYXMobmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkcyBhIG5ldyBjc3MgY2xhc3MgYW4gZWxlbWVudCBpZiBpdCBhbHJlYWR5IGRvZXMgbm90IGV4aXN0XG4gICAgICAgICAqIFRoZSByZXBsYWNlIGZsYWcgd2lsbCByZXBsYWNlIHRoZSBleGlzdHNpbmcgY3NzIGNsYXNzIHZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgYWRkQ3NzQ2xhc3MoY3NzOiBzdHJpbmcgfCBzdHJpbmdbXSwgcmVwbGFjZTogYm9vbGVhbiA9IGZhbHNlKTogQmxlbmQuZG9tLkVsZW1lbnQge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcywgdDogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgICAgICAgICAgaWYgKHJlcGxhY2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWUuY2xhc3NMaXN0LmFkZCg8QXJyYXk8c3RyaW5nPj5CbGVuZC53cmFwSW5BcnJheShjc3MpKTtcbiAgICAgICAgICAgIG1lLmNsYXNzTGlzdC5zZXJpYWxpemVUbyhtZS5lbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIG9uZSBvZiBtb3JlIENTUyBjbGFzc2VzIGZyb20gdGhpcyBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgcmVtb3ZlQ3NzQ2xhc3MoY3NzOiBzdHJpbmcgfCBzdHJpbmdbXSk6IEJsZW5kLmRvbS5FbGVtZW50IHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsIHQ6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgICAgIG1lLmNsYXNzTGlzdC5yZW1vdmUoPEFycmF5PHN0cmluZz4+QmxlbmQud3JhcEluQXJyYXkoY3NzKSk7XG4gICAgICAgICAgICBtZS5jbGFzc0xpc3Quc2VyaWFsaXplVG8obWUuZWwpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyBvbmUgb3IgbW9yZSBDU1MgY2xhc3NlcyBmcm9tIHRoaXMgZWxlbWVudCBieSBjaGVja2luZyBpZiB0aGVcbiAgICAgICAgICogQ1NTIG5hbWVzIHN0YXJ0IHdpdGggdGhlIGdpdmVuIHJlcXVlc3RcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyByZW1vdmVDc3NDbGFzc0xpa2UoY3NzOiBzdHJpbmcgfCBzdHJpbmdbXSk6IEJsZW5kLmRvbS5FbGVtZW50IHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsIHQ6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgICAgIG1lLmNsYXNzTGlzdC5yZW1vdmVMaWtlKDxBcnJheTxzdHJpbmc+PkJsZW5kLndyYXBJbkFycmF5KGNzcykpO1xuICAgICAgICAgICAgbWUuY2xhc3NMaXN0LnNlcmlhbGl6ZVRvKG1lLmVsKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFycyB0aGUgdmFsdWUgb2YgdGhlIGNsYXNzIGF0dHJpYnV0ZSBvZiB0aGlzIGVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBjbGVhckNzc0NsYXNzKCk6IEJsZW5kLmRvbS5FbGVtZW50IHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmNsZWFyKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSBjaGlsZCBlbGVtZW50cyBmcm9tIHRoaXMgRWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgY2xlYXJFbGVtZW50KCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIGlmIChtZS5lbCkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChtZS5lbC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lLmVsLnJlbW92ZUNoaWxkKG1lLmVsLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBkYXRhLSogYXR0cmlidXRlIGZvciB0aGlzIGVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzZXREYXRhKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IEJsZW5kLmRvbS5FbGVtZW50IHtcbiAgICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiZGF0YS1cIiArIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgYSBkYXRhIGF0dHJpYnV0ZSBvciByZXR1cm5zIGEgZGVmYXVsdCB2YWx1ZSBpZiB0aGUgYXR0cmlidXRlIGRvZXNcbiAgICAgICAgICogbm90IGV4aXN0XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZ2V0RGF0YShuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogYW55ID0gbnVsbCk6IGFueSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGF0dHI6IHN0cmluZyA9IFwiZGF0YS1cIiArIG5hbWU7XG4gICAgICAgICAgICByZXR1cm4gbWUuZWwuaGFzQXR0cmlidXRlKGF0dHIpID8gbWUuZWwuZ2V0QXR0cmlidXRlKGF0dHIpIDogZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgU2Nyb2xsIHN0YXRlIGZvciB0aGlzIEVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzY3JvbGxTdGF0ZShzdGF0ZTogQmxlbmQuZVNjcm9sbFN0YXRlKTogQmxlbmQuZG9tLkVsZW1lbnQge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLnNldERhdGEoXCJzY3JvbGxcIiwgQmxlbmQuZVNjcm9sbFN0YXRlWzxudW1iZXI+c3RhdGVdKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVuYWJsZXMvRGlzYWJsZXMgdGhlIHRleHQgc2VsZWN0IHN0YXRlIG9mIHRoaXMgZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHNlbGVjdGFibGUoc3RhdGU6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShcInNlbGVjdGFibGVcIiwgc3RhdGUgPT09IHRydWUgPyBcIm9uXCIgOiBcIm9mZlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIHRoZSBuYXRpdmUgSFRNTEVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRFbCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBlbmRzIGEgY2hpbGQgRWxlbWVudCB0byB0aGlzIEVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBhcHBlbmQoY2hpbGQ6IEJsZW5kLmRvbS5FbGVtZW50KTogQmxlbmQuZG9tLkVsZW1lbnQge1xuICAgICAgICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZCgoY2hpbGQuZ2V0RWwoKSkpO1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhpcyBlbGVtZW50IGZyb20gaXRzIHBhcmVudFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHJlbW92ZSgpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsXG4gICAgICAgICAgICAgICAgcE5vZGU6IE5vZGUsXG4gICAgICAgICAgICAgICAgY05vZGU6IE5vZGU7XG4gICAgICAgICAgICBjTm9kZSA9IG1lLmVsO1xuICAgICAgICAgICAgcE5vZGUgPSBjTm9kZS5wYXJlbnROb2RlIHx8IG51bGw7XG4gICAgICAgICAgICBpZiAocE5vZGUpIHtcbiAgICAgICAgICAgICAgICBwTm9kZS5yZW1vdmVDaGlsZChjTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgaW5uZXIgSFRNTCBvZiB0aGlzIGVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzZXRIdG1sKGh0bWw6IHN0cmluZyk6IEJsZW5kLmRvbS5FbGVtZW50IHtcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldFBhZGRpbmcodmFsdWU6IG51bWJlciB8IFBhZGRpbmdJbnRlcmZhY2UpOiBCbGVuZC5kb20uRWxlbWVudCB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLCBwYWRkaW5nOiBQYWRkaW5nSW50ZXJmYWNlID0ge307XG4gICAgICAgICAgICBpZiAoQmxlbmQuaXNOdW1lcmljKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIG1lLnNldFN0eWxlKHsgcGFkZGluZzogPG51bWJlcj52YWx1ZSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWUuc2V0U3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBcInBhZGRpbmctdG9wXCI6ICg8UGFkZGluZ0ludGVyZmFjZT52YWx1ZSkudG9wIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicGFkZGluZy1yaWdodFwiOiAoPFBhZGRpbmdJbnRlcmZhY2U+dmFsdWUpLnJpZ2h0IHx8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicGFkZGluZy1ib3R0b21cIjogKDxQYWRkaW5nSW50ZXJmYWNlPnZhbHVlKS5ib3R0b20gfHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJwYWRkaW5nLWxlZnRcIjogKDxQYWRkaW5nSW50ZXJmYWNlPnZhbHVlKS5sZWZ0IHx8IG51bGxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIGlubmVyIEhUTUwgb2YgdGhpcyBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZ2V0SHRtbCgpOiBzdHJpbmcge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWwuaW5uZXJIVE1MO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZWQgYW4gRWxlbWVudCBiYXNlZCBvbiBDcmVhdGVFbGVtZW50SW50ZXJmYWNlXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShjb25mOiBDcmVhdGVFbGVtZW50SW50ZXJmYWNlIHwgQmxlbmQuZG9tLkVsZW1lbnRDb25maWdCdWlsZGVyLCBlbENhbGxiYWNrPzogRnVuY3Rpb24sIGVsQ2FsbGJhY2tTY29wZT86IGFueSk6IEJsZW5kLmRvbS5FbGVtZW50IHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsIGNvbmZpZzogQ3JlYXRlRWxlbWVudEludGVyZmFjZTtcbiAgICAgICAgICAgIGlmIChCbGVuZC5pc0luc3RhbmNlT2YoY29uZiwgQmxlbmQuZG9tLkVsZW1lbnRDb25maWdCdWlsZGVyKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZyA9ICg8QmxlbmQuZG9tLkVsZW1lbnRDb25maWdCdWlsZGVyPmNvbmYpLmdldENvbmZpZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSA8Q3JlYXRlRWxlbWVudEludGVyZmFjZT5jb25mO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKEJsZW5kLmlzT2JqZWN0KGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWw6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChjb25maWcudGFnIHx8IFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGNmZyBpbiBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDogYW55ID0gKDxhbnk+Y29uZmlnKVtjZmddO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2ZnICE9PSBcInRhZ1wiICYmIGNmZyAhPT0gXCJzY29wZVwiICYmIGNmZyAhPT0gXCJvaWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNmZyA9PT0gXCJjbHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNmZyA9IFwiY2xhc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQmxlbmQuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IDxBcnJheTxzdHJpbmc+PnZhbC5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNmZyA9PT0gXCJpbm5lckhUTUxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNmZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjZmcgPT09IFwidGV4dFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2ZnID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dE5kID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0TmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjZmcgPT09IFwibGlzdGVuZXJzXCIgJiYgQmxlbmQuaXNPYmplY3QodmFsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNmZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgZSBpbiB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSB2YWxbZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJsZW5kLlJ1bnRpbWUuYWRkRXZlbnRMaXN0ZW5lcihlbCwgZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmFwcGx5KGNvbmZpZy5zY29wZSB8fCB3aW5kb3csIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ZnID09PSBcImNoaWxkcmVuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUJsZW5kLmlzQXJyYXkodmFsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsLmZvckVhY2goZnVuY3Rpb24oY2hpbGQ6IEhUTUxFbGVtZW50IHwgQ3JlYXRlRWxlbWVudEludGVyZmFjZSB8IEJsZW5kLmRvbS5FbGVtZW50IHwgQmxlbmQuZG9tLkVsZW1lbnRDb25maWdCdWlsZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCg8SFRNTEVsZW1lbnQ+Y2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgQmxlbmQuZG9tLkVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKCg8QmxlbmQuZG9tLkVsZW1lbnQ+Y2hpbGQpLmdldEVsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgQmxlbmQuZG9tLkVsZW1lbnRDb25maWdCdWlsZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChCbGVuZC5kb20uRWxlbWVudC5jcmVhdGUoKDxCbGVuZC5kb20uRWxlbWVudENvbmZpZ0J1aWxkZXI+Y2hpbGQpLCBlbENhbGxiYWNrLCBlbENhbGxiYWNrU2NvcGUpLmdldEVsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoQmxlbmQuZG9tLkVsZW1lbnQuY3JlYXRlKDxDcmVhdGVFbGVtZW50SW50ZXJmYWNlPmNoaWxkLCBlbENhbGxiYWNrLCBlbENhbGxiYWNrU2NvcGUpLmdldEVsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2ZnID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ZnID09PSBcImRhdGFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJsZW5kLmZvckVhY2godmFsLCBmdW5jdGlvbih2OiBhbnksIGs6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLVwiICsgaywgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2ZnID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ZnID09PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZmcgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJsZW5kLmdldEVsZW1lbnQoZWwpLnNldFN0eWxlKDxTdHlsZUludGVyZmFjZT52YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjZmcgPT09IFwic2VsZWN0YWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQmxlbmQuZ2V0RWxlbWVudChlbCkuc2VsZWN0YWJsZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNmZyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2ZnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGNmZywgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgd0VsID0gbmV3IEJsZW5kLmRvbS5FbGVtZW50KGVsKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxDYWxsYmFjayAmJiBjb25maWcub2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsQ2FsbGJhY2suYXBwbHkoZWxDYWxsYmFja1Njb3BlIHx8IHdpbmRvdywgW3dFbCwgY29uZmlnLm9pZF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gd0VsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQmxlbmQuY3JlYXRlRWxlbWVudCh7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm5hbWVzcGFjZSBCbGVuZCB7XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcGVyIGZvciBCbGVuZC5kb20uRWxlbWVudC5jcmVhdGVcbiAgICAgKi9cbiAgICBleHBvcnQgdmFyIGNyZWF0ZUVsZW1lbnQgPSBCbGVuZC5kb20uRWxlbWVudC5jcmVhdGU7XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcGVyIGZvciBkb2N1bWVudC5xdWVyeVNlbGVjdG9yXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEVsZW1lbnQocXVlcnk6IHN0cmluZywgZnJvbTogQmxlbmQuZG9tLkVsZW1lbnQgPSBudWxsKTogQmxlbmQuZG9tLkVsZW1lbnQge1xuICAgICAgICB2YXIgZWxzID0gQmxlbmQuc2VsZWN0RWxlbWVudHMocXVlcnksIGZyb20pO1xuICAgICAgICByZXR1cm4gZWxzWzBdIHx8IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV3JhcHBlciBmb3IgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbFxuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBzZWxlY3RFbGVtZW50cyhxdWVyeTogc3RyaW5nLCBmcm9tOiBCbGVuZC5kb20uRWxlbWVudCA9IG51bGwpOiBBcnJheTxCbGVuZC5kb20uRWxlbWVudD4ge1xuICAgICAgICB2YXIgZWxzOiBBcnJheTxCbGVuZC5kb20uRWxlbWVudD4gPSBbXTtcbiAgICAgICAgQmxlbmQuZm9yRWFjaCgoKGZyb20gPyBmcm9tLmdldEVsKCkgOiBudWxsKSB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChxdWVyeSksIGZ1bmN0aW9uKGVsOiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKEJsZW5kLmlzSW5zdGFuY2VPZihlbCwgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgZWxzLnB1c2gobmV3IEJsZW5kLmRvbS5FbGVtZW50KGVsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZWxzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdyYXBwZXIgZm9yIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkXG4gICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50KGVsOiBzdHJpbmcgfCBIVE1MRWxlbWVudCk6IEJsZW5kLmRvbS5FbGVtZW50IHtcbiAgICAgICAgaWYgKEJsZW5kLmlzU3RyaW5nKGVsKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCbGVuZC5kb20uRWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCg8c3RyaW5nPmVsKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJsZW5kLmRvbS5FbGVtZW50KDxIVE1MRWxlbWVudD5lbCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJpbmRpbmcvQmluZGluZ1Byb3ZpZGVyLnRzXCIgLz5cblxubmFtZXNwYWNlIEJsZW5kIHtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQ2FsbGJhY2sgaW50ZXJmYWNlIGZvciB0aGUgcmVhZHkgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBpbnRlcmZhY2UgSVJlYWRDYWxsYmFjayB7XG4gICAgICAgIGZuOiBGdW5jdGlvbjtcbiAgICAgICAgc2M/OiBhbnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBNZWRpYSBRdWVyeSByZWdpc3RlcnkgdGhhdCBob2xkIGEgbGlzbmV0ZXJzIGZvciB0aGUgVmlld3NcbiAgICAgKiByZXNwb25kaW5nIHRvIGEgbWVkaWEgcXVlcnlcbiAgICAgICovXG4gICAgaW50ZXJmYWNlIElNZWRpYVF1ZXJ5UmVnaXN0ZXJ5IGV4dGVuZHMgRGljdGlvbmFyeUludGVyZmFjZSB7XG4gICAgICAgIFtuYW1lOiBzdHJpbmddOiBBcnJheTxGdW5jdGlvbj47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBNZWRpYSBRdWVyeSBtYXRjaGVyIHJlZ2lzdGVyeVxuICAgICAqL1xuICAgIGludGVyZmFjZSBJTWVkaWFRdWVyeU1hdGNoZXIgZXh0ZW5kcyBEaWN0aW9uYXJ5SW50ZXJmYWNlIHtcbiAgICAgICAgW25hbWU6IHN0cmluZ106IE1lZGlhUXVlcnlMaXN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb3ZpZGVzIGZ1bmN0aW9uYWxpdHkgdG8gZ2V0IEJsZW5kIGtpY2tzdGFydGVkIGFuZCBjaGVjayBmb3JcbiAgICAgKiBicm93ZXIgY29tcGF0aWJpbGl0eVxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBSdW50aW1lU2luZ2xldG9uIHtcblxuICAgICAgICBwcml2YXRlIHJlYWR5Q2FsbGJhY2tzOiBBcnJheTxJUmVhZENhbGxiYWNrPjtcbiAgICAgICAgcHJpdmF0ZSBraWNrU3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwcml2YXRlIG1lZGlhUXVlcnlSZWdpc3Rlcnk6IElNZWRpYVF1ZXJ5UmVnaXN0ZXJ5O1xuICAgICAgICBwcml2YXRlIG1lZGlhUXVlcnlNYXRjaGVyczogSU1lZGlhUXVlcnlNYXRjaGVyO1xuICAgICAgICBwcml2YXRlIHByZXZpb3VzTWVkaWFRdWVyeTogc3RyaW5nOyAvLyB1c2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgZXZlbnRzIG9mIHNhbWUgYWxpYXNcblxuICAgICAgICBwdWJsaWMgQmluZGVyOiBCbGVuZC5iaW5kaW5nLkJpbmRpbmdQcm92aWRlcjtcbiAgICAgICAgcHVibGljIElFOiBib29sZWFuO1xuICAgICAgICBwdWJsaWMgSUVWZXJzaW9uOiBudW1iZXI7XG5cbiAgICAgICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5CaW5kZXIgPSBuZXcgQmxlbmQuYmluZGluZy5CaW5kaW5nUHJvdmlkZXIoKTtcbiAgICAgICAgICAgIHRoaXMubWVkaWFRdWVyeVJlZ2lzdGVyeSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5tZWRpYVF1ZXJ5TWF0Y2hlcnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVc2VkIHRvIHRyaWdnZXIgdGhlIG1lZGlhIHF1ZXJ5IG1hdGNoaW5nIG9uIGFwcGxpY2F0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHRyaWdnZXJNZWRpYVF1ZXJ5Q2hlY2soKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgQmxlbmQuZm9yRWFjaChtZS5tZWRpYVF1ZXJ5TWF0Y2hlcnMsIGZ1bmN0aW9uKG1xbDogTWVkaWFRdWVyeUxpc3QsIG1lZGlhUXVlcnk6IHN0cmluZykge1xuICAgICAgICAgICAgICAgIGlmIChtcWwubWF0Y2hlcyAmJiBtZS5wcmV2aW91c01lZGlhUXVlcnkgIT09IG1lZGlhUXVlcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWUubWVkaWFRdWVyeVJlZ2lzdGVyeVttZWRpYVF1ZXJ5XS5mb3JFYWNoKGZ1bmN0aW9uKGZuOiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm4uYXBwbHkobWUsIFttcWxdKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIG1lLnByZXZpb3VzTWVkaWFRdWVyeSA9IG1lZGlhUXVlcnk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGRzIGEgbWVkaWEgcXVlcnkgbGlzdGVuZXJcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBhZGRNZWRpYVF1ZXJ5TGlzdGVuZXIobWVkaWFRdWVyeTogc3RyaW5nLCBsaXN0ZW5lcjogRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAobWUubWVkaWFRdWVyeVJlZ2lzdGVyeVttZWRpYVF1ZXJ5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbWUubWVkaWFRdWVyeVJlZ2lzdGVyeVttZWRpYVF1ZXJ5XSA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBtcWw6IE1lZGlhUXVlcnlMaXN0ID0gd2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSk7XG4gICAgICAgICAgICAgICAgbWUubWVkaWFRdWVyeU1hdGNoZXJzW21lZGlhUXVlcnldID0gbXFsO1xuICAgICAgICAgICAgICAgIG1xbC5hZGRMaXN0ZW5lcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbWUudHJpZ2dlck1lZGlhUXVlcnlDaGVjaygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWUubWVkaWFRdWVyeVJlZ2lzdGVyeVttZWRpYVF1ZXJ5XS5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgYnJvd3NlciBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGlzU3VwcG9ydGVkQnJvd3NlcigpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsXG4gICAgICAgICAgICAgICAgaWUgPSBtZS5kZXRlY3RJRSgpO1xuICAgICAgICAgICAgbWUuSUUgPSBpZSAhPT0gMDtcbiAgICAgICAgICAgIG1lLklFVmVyc2lvbiA9IGllO1xuICAgICAgICAgICAgaWYgKGllICE9PSAwICYmIGllIDwgMTEpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC53cml0ZShcIjxkaXYgaWQ9XFxcIm5vYmxlbmRcXFwiPlVuYWJsZSB0byBydW4gdGhpcyBhcHBsaWNhdGlvbi4gUGxlYXNlIHVwZ3JhZGUgeW91ciBJbnRlcm5ldCBFeHBsb3JlciB0byB2ZXJzaW9uIDExIG9yIGFib3ZlLCBvdGhlcndpc2UgdXNlIEdvb2dsZSBDaHJvbWUgb3IgRmlyZWZveCE8L2Rpdj5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldHMgdGhlIFwicmVhZHlcIiBjYWxsYmFjayBidWZmZXJcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyByZXNldCgpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5yZWFkeUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZHMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBydW4gd2hlbiB0aGUgYnJvd3NlciBpcyByZWFkeSB0byBnb1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZHkoY2FsbGJhY2s6IEZ1bmN0aW9uLCBzY29wZT86IGFueSk6IEJsZW5kLlJ1bnRpbWVTaW5nbGV0b24ge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIGlmICghbWUucmVhZHlDYWxsYmFja3MpIHtcbiAgICAgICAgICAgICAgICBtZS5yZWFkeUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWUucmVhZHlDYWxsYmFja3MucHVzaCh7XG4gICAgICAgICAgICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgICAgICAgICAgIHNjOiBzY29wZSB8fCBtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWF0ZXMgQmxlbmQncyBhcHBsaWNhdGlvbiBsaWZlY3ljbGUgYnkgZXhlY3V0aW5nIHRoZSBjYWxsYmFja3NcbiAgICAgICAgICogd2hpY2ggYXJlIHJlZ2lzdGVyZWQgYnkge0Vudmlyb25tZW50LnJlYWR5fS4gVGhpcyBmdW5jdGlvbiBuZWVkcyB0byBjYWxsZWRcbiAgICAgICAgICogdG8gZ2V0IGEgQmxlbmQgYXBwbGljYXRpb24gc3RhcnRlZC5cbiAgICAgICAgICovXG4gICAgICAgIGtpY2tTdGFydCgpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsXG4gICAgICAgICAgICAgICAgZGlkUnVuID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgZG9DYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlkUnVuID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlkUnVuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZS5pc1N1cHBvcnRlZEJyb3dzZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJsZW5kLmZvckVhY2gobWUucmVhZHlDYWxsYmFja3MsIGZ1bmN0aW9uKGl0ZW06IElSZWFkQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5mbi5hcHBseShpdGVtLnNjLCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gZW1wdHkgdGhlIGNhbGxiYWNrcyBhZnRlciBydW5uaW5nIG9uY2UgaW5jYXNlIHdlIGhhdmUgbGF0ZVxuICAgICAgICAgICAgICAgICAgICAvLyByZWFkeSguLi4pIGNhbGxzIGxhdGVyLCBzbyB3ZSBkb24ndCBydW4gcHJldmlvdXMgY2FsbHMgYWdhaW4uXG4gICAgICAgICAgICAgICAgICAgIG1lLnJlYWR5Q2FsbGJhY2tzID0gW107XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCFtZS5raWNrU3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIG1lLmtpY2tTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvQ2FsbGJhY2suYXBwbHkobWUsIFtdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtZS5hZGRFdmVudExpc3RlbmVyKGRvY3VtZW50LCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZG9DYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIG1lLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCBcImxvYWRcIiwgZG9DYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb0NhbGxiYWNrLmFwcGx5KG1lLCBbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkcyBhbiBFdmVudExpc3RlbmVyIHRvIGFuIEV2ZW50VGFyZ2V0LiBZb3UgY2FuIGFkZCBtdWx0aXBsZSBldmVudHMgYnlcbiAgICAgICAgICogcHJvdmlkaW5nIGV2ZW50IG5hbWVzIHNlcGVyYXRlZCBieSBzcGFjZXMgKGVnLiAnbW91c2V1cCBjbGljaycpXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgYWRkRXZlbnRMaXN0ZW5lcihlbDogRXZlbnRUYXJnZXQsIGV2ZW50TmFtZTogc3RyaW5nLCBldmVudEhhbmRsZXI6IEV2ZW50TGlzdGVuZXIpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChldmVudE5hbWUuaW5kZXhPZihcIiBcIikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZXZlbnROYW1lLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGZ1bmN0aW9uKGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGVOYW1lID0gZU5hbWUudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZU5hbWUubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGVOYW1lLCBldmVudEhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyBhbiBFdmVudExpc3RlbmVyIGZyb20gYW4gRXZlbnRUYXJnZXQuIFlvdSBjYW4gcmVtb3ZlIG11bHRpcGxlIGV2ZW50cyBieVxuICAgICAgICAgKiBwcm92aWRpbmcgZXZlbnQgbmFtZXMgc2VwZXJhdGVkIGJ5IHNwYWNlcyAoZWcuICdtb3VzZXVwIGNsaWNrJylcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyByZW1vdmVFdmVudExpc3RlbmVyKGVsOiBFdmVudFRhcmdldCwgZXZlbnROYW1lOiBzdHJpbmcsIGV2ZW50SGFuZGxlcjogRXZlbnRMaXN0ZW5lcik6IHZvaWQge1xuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZS5pbmRleE9mKFwiIFwiKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBldmVudE5hbWUuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24oZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZU5hbWUgPSBlTmFtZS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlTmFtZS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZU5hbWUsIGV2ZW50SGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBldmVudEhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZGV0ZWN0SUUoKTogbnVtYmVyIHtcbiAgICAgICAgICAgIC8vIGNvcHlyaWdodCBodHRwOi8vY29kZXBlbi5pby9nYXBjb2RlL3Blbi92RUpOWk5cbiAgICAgICAgICAgIHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICAgICAgdmFyIG1zaWUgPSB1YS5pbmRleE9mKFwiTVNJRSBcIik7XG4gICAgICAgICAgICBpZiAobXNpZSA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBJRSAxMCBvciBvbGRlciA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKG1zaWUgKyA1LCB1YS5pbmRleE9mKFwiLlwiLCBtc2llKSksIDEwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRyaWRlbnQgPSB1YS5pbmRleE9mKFwiVHJpZGVudC9cIik7XG4gICAgICAgICAgICBpZiAodHJpZGVudCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBJRSAxMSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgICAgICAgICAgICB2YXIgcnYgPSB1YS5pbmRleE9mKFwicnY6XCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcocnYgKyAzLCB1YS5pbmRleE9mKFwiLlwiLCBydikpLCAxMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlZGdlID0gdWEuaW5kZXhPZihcIkVkZ2UvXCIpO1xuICAgICAgICAgICAgaWYgKGVkZ2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRWRnZSAoSUUgMTIrKSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKGVkZ2UgKyA1LCB1YS5pbmRleE9mKFwiLlwiLCBlZGdlKSksIDEwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHbG9iYWwgcmVmZXJlbmNlIHRvIHRoZSBSdW50aW1lU2luZ2xldG9uXG4gICAgICovXG4gICAgZXhwb3J0IHZhciBSdW50aW1lID0gbmV3IFJ1bnRpbWVTaW5nbGV0b24oKTtcbn0iLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IFRydWVTb2Z0d2FyZSBCLlYuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tbW9uL1V0aWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJkb20vRWxlbWVudC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9SdW50aW1lLnRzXCIgLz5cblxubmFtZXNwYWNlIEJsZW5kIHtcblxuICAgIGV4cG9ydCBjbGFzcyBlTWVkaWFRdWVyeSB7XG4gICAgICAgIHN0YXRpYyBMQVJHRTogc3RyaW5nID0gXCJMXCI7XG4gICAgICAgIHN0YXRpYyBNRURJVU06IHN0cmluZyA9IFwiTVwiO1xuICAgICAgICBzdGF0aWMgU01BTEw6IHN0cmluZyA9IFwiU1wiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVsZW1lbnQgU2Nyb2xsIHZhbHVlc1xuICAgICAqL1xuICAgIGV4cG9ydCBlbnVtIGVTY3JvbGxTdGF0ZSB7XG4gICAgICAgIG5vbmUsXG4gICAgICAgIGF1dG8sXG4gICAgICAgIGJvdGgsXG4gICAgICAgIGhvcml6b250YWwsXG4gICAgICAgIHZlcnRpY2FsXG4gICAgfVxuXG4gICAgZXhwb3J0IHZhciByZWdpc3RyeTogQ2xhc3NSZWdpc3RyeUludGVyZmFjZSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogUHV0IHRoZSBmcmFtZXdvcmsgaW4gREVCVUcgbW9kZVxuICAgICAqL1xuICAgIGV4cG9ydCB2YXIgREVCVUc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICB2YXIgSUQgPSAxMDAwO1xuXG4gICAgZXhwb3J0IHZhciBDT01NT05fTUVESUFfUVVFUklFUzogRGljdGlvbmFyeUludGVyZmFjZSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogSU1QT1JUQU5UOiBGb3IgdGhlIG1lZGlhIHF1ZXJpZXMgdG8gd29yayBwcm9wZXJseSwgd2UgbmVlZCB0byBkZWZpbmUgdGhlbSBmcm9tXG4gICAgICogbGFyZ2UgdG8gc21hbGwgYmVjYXVzZSB0aGUgTWVkaWEgUXVlcnkgY2hlY2sgd2lsbCBtYXRjaCB0aGUgZmlyc3Qgb25lIGFuZFxuICAgICAqIHRyaWdnZXIgdGhlIHJlc3BvbnNpdmVDaGFuZ2UgZXZlbnQgYW5kIG90aGVyIG1hdGNoaW5nIG1lZGllYSBxdWVyaWVzIHdpbGwgYmVcbiAgICAgKiBpZ25vcmVkIVxuICAgICAqL1xuICAgIENPTU1PTl9NRURJQV9RVUVSSUVTW2VNZWRpYVF1ZXJ5LkxBUkdFXSA9IFwiKG1pbi13aWR0aCA6IDg0MHB4KVwiO1xuICAgIENPTU1PTl9NRURJQV9RVUVSSUVTW2VNZWRpYVF1ZXJ5Lk1FRElVTV0gPSBcIihtaW4td2lkdGg6IDQ4MHB4KSBhbmQgKG1heC13aWR0aDogODM5cHgpXCI7XG4gICAgQ09NTU9OX01FRElBX1FVRVJJRVNbZU1lZGlhUXVlcnkuU01BTExdID0gXCIobWF4LXdpZHRoIDogNDc5cHgpXCI7XG5cblxuICAgIC8qKlxuICAgICAqIEJpbmQgd3JhcHMgYSBmdW5jdGlvbiBpbnRvIGEgbmV3IGZ1bmN0aW9ucyBzbyBpdCBjYW4gcnVuIGluIGEgZ2l2ZW4gc2NvcGVcbiAgICAgKiB3aG4gdGhlIG5ldyBmdW5jdGlvbiBpcyBjYWxsZWQuXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGJpbmQoc2NvcGU6IGFueSwgZm46IEZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmbi5hcHBseShzY29wZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSBuZXcgc2VxdWVudGlhbCBJRCB1c2VkIGludGVybmFsbHkgZm9yIGRlYnVnZ2luZ1xuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBuZXdJRCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gSUQrKztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGVudW0gdmFsdWUsIGVpdGhlciB0aGUgdmFsdWUgYXMgbnVtYmVyIG9yIGl0cyBzdHJpbmcgcmVwcmVzZW50YXRpb25cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gcGFyc2VFbnVtPFQ+KG9iakVudW06IGFueSwgdmFsdWU6IHN0cmluZyB8IG51bWJlciwgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsKTogVCB7XG4gICAgICAgIGlmIChCbGVuZC5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmpFbnVtW3ZhbHVlXSA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbHVlIDogb2JqRW51bVt2YWx1ZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqRW51bVtvYmpFbnVtW3ZhbHVlXV0gPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWx1ZSA6IG9iakVudW1bb2JqRW51bVt2YWx1ZV1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBhIGZ1bmN0aW9uXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGEgc3RyaW5nXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gdmFsdWUgaXMgbnVsbCBvciB1bmRlZmluZWRcbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gaXNOdWxsT3JVbmRlZih2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gdmFsdWUgaXMgYW4gYXJyYXlcbiAgICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkodmFsdWU6IGFueSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseSh2YWx1ZSkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGEgbnVtYmVyXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIC8vIE9yaWdpbmFsIHNvdXJjZTogSlF1ZXJ5XG4gICAgICAgIHJldHVybiB2YWx1ZSAtIHBhcnNlRmxvYXQodmFsdWUpID49IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBhbiBvYmplY3RcbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWU6IGFueSkge1xuICAgICAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgIUJsZW5kLmlzQXJyYXkodmFsdWUpKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYW4gb2JqZWN0IGluIGFuIGFycmF5IGlmIHRoZSBvYmplY3QgaXMgbm90IGFuIGFycmF5IGl0c2VsZlxuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiB3cmFwSW5BcnJheTxUPihvYmo6IGFueSk6IEFycmF5PFQ+IHtcbiAgICAgICAgcmV0dXJuIEJsZW5kLmlzQXJyYXkob2JqKSA/IG9iaiA6IEJsZW5kLmlzTnVsbE9yVW5kZWYob2JqKSA/IFtdIDogW29ial07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29waWVzIGtleXMgYW5kIHZhbHVlcyBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlclxuICAgICAqIEBwYXJhbSB7YW55fSB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge2FueX0gc291cmNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBvdmVyd3JpdGUgdGhlIGNoaWxkIG9iamVjdHMgb3IgYXJyYXlzXG4gICAgICogQHBhcmFtIHttZXJnZUFycmF5c30gd2lsbCBtZXJnZSBhcnJheXMgaW5zdGVhZCBvZiBvdmVyd3JpdGluZyB0aGVtXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGFwcGx5KHRhcmdldDogYW55LCBzb3VyY2U6IGFueSwgb3ZlcndyaXRlOiBib29sZWFuID0gZmFsc2UsIG1lcmdlQXJyYXlzOiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xuICAgICAgICB2YXIga2V5OiBhbnksXG4gICAgICAgICAgICB0YXJnZXRLZXlzID0gT2JqZWN0LmtleXModGFyZ2V0IHx8IHt9KSxcbiAgICAgICAgICAgIHRhcmdldEhhc0tleSA9IGZ1bmN0aW9uIChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRLZXlzLmluZGV4T2Yoa2V5KSAhPT0gLTE7XG4gICAgICAgICAgICB9O1xuICAgICAgICBvdmVyd3JpdGUgPSBvdmVyd3JpdGUgfHwgZmFsc2U7XG4gICAgICAgIG1lcmdlQXJyYXlzID0gbWVyZ2VBcnJheXMgfHwgZmFsc2U7XG5cbiAgICAgICAgaWYgKHRhcmdldCAmJiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkgJiYgc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldEhhc0tleShrZXkpICYmIEJsZW5kLmlzT2JqZWN0KHRhcmdldFtrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJ3cml0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJsZW5kLmFwcGx5KHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0SGFzS2V5KGtleSkgJiYgQmxlbmQuaXNBcnJheSh0YXJnZXRba2V5XSkgJiYgbWVyZ2VBcnJheXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gdGFyZ2V0W2tleV0uY29uY2F0KEJsZW5kLndyYXBJbkFycmF5KHNvdXJjZVtrZXldKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0SGFzS2V5KGtleSkgJiYgb3ZlcndyaXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEJsZW5kLmlzTnVsbE9yVW5kZWYodGFyZ2V0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBhIGJvb2xlYW5cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gaXNCb29sZWFuKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgKHZhbHVlKSA9PT0gXCJib29sZWFuXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2l2ZSB2YWx1ZSBpcyBpbnN0YW5jZSBvZiBhbm90aGVyIGNsYXNzL2Z1bmN0aW9uXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzSW5zdGFuY2VPZihvYmo6IGFueSwgY2xheno6IGFueSk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGlmIChvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoYyA9IFwiW29iamVjdCBIVE1MQ29sbGVjdGlvbl1cIjtcbiAgICAgICAgaWYgKG9iai50b1N0cmluZygpID09PSBoYyAmJiBjbGF6eiA9PT0gXCJIVE1MQ29sbGVjdGlvblwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChCbGVuZC5pc1N0cmluZyhjbGF6eikpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24oXCJcIiwgXCIgdHJ5IHsgcmV0dXJuIFwiICsgY2xhenogKyBcIiB9IGNhdGNoKGUpIHsgcmV0dXJuIG51bGwgfTtcIik7XG4gICAgICAgICAgICAgICAgY2xhenogPSBmbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzID0gKG9iaiBpbnN0YW5jZW9mIGNsYXp6KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvb3BzIHRob3VnaCB0aGUgZ2l2ZW4gb2JqZWN0IChhcnJheSwgZGljdGlvbmFyeSkgYW5kIHJ1bnMgYSBjYWxsYmFjayBvbiBlYWNoIGl0ZW0uXG4gICAgICogVGhlIGNhbGxiYWNrIGxvb3Agd2lsbCBicmVhayB3aGVuIHRoZSBjYWxsYmFjayBmdW5jdGlvbiByZXR1cm5zIFwiZmFsc2VcIiBleHBsaWNpdGx5IVxuICAgICAqIFRoZSBjYWxsYmFjayBoYXMgdGhlIGZvbGxvd2luZyBzaWduYXR1cmU6XG4gICAgICogZnVuY3Rpb24oaXRlbTphbnksIGluZGV4Om51bWJlcnxzdHJpbmcsIHNjb3BlOmFueSA9IG9iaikge1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gZm9yRWFjaChvYmo6IGFueSwgY2FsbGJhY2s6IEZ1bmN0aW9uLCBzY29wZT86IGFueSkge1xuICAgICAgICBpZiAodHlwZW9mIEhUTUxDb2xsZWN0aW9uID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB2YXIgSFRNTENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGtleTogYW55O1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICBpZiAoQmxlbmQuaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChCbGVuZC5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGVuZ3RoOiBudW1iZXIgPSBvYmoubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoa2V5ID0gMDsga2V5IDwgbGVuZ3RoOyBrZXkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChzY29wZSwgb2JqW2tleV0sIHBhcnNlSW50KGtleSksIG9iaikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQmxlbmQuaXNJbnN0YW5jZU9mKG9iaiwgXCJIVE1MQ29sbGVjdGlvblwiKSkge1xuICAgICAgICAgICAgICAgIHZhciBsZW5ndGg6IG51bWJlciA9IG9iai5sZW5ndGgsIGtleTogYW55LCBlbDogSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgZm9yIChrZXkgPSAwOyBrZXkgIT09IGxlbmd0aDsga2V5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZWwgPSBvYmouaXRlbShrZXkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ICE9PSBcImxlbmd0aFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChzY29wZSwgZWwsIHBhcnNlSW50KGtleSksIG9iaikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHNjb3BlLCBvYmpba2V5XSwga2V5LCBvYmopID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIENyZWF0ZSBhIG5ldyBCbGVuZC5Db21wb25lbnQgb2JqZWN0XG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudDxUIGV4dGVuZHMgQmxlbmQuQ29tcG9uZW50PihjbGF6ejogQ29tcG9uZW50VHlwZXMsIGNvbmZpZzogYW55ID0gbnVsbCk6IFQge1xuICAgICAgICBpZiAodHlwZW9mIChjbGF6eikgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGlmIChCbGVuZC5yZWdpc3RyeVsoPHN0cmluZz5jbGF6eildKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJsZW5kLmNyZWF0ZUNvbXBvbmVudDxUPihCbGVuZC5yZWdpc3RyeVsoPHN0cmluZz5jbGF6eildLCBjb25maWcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gY2xhc3MgYWxpYXMgJHtjbGF6en1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChCbGVuZC5pc0NsYXNzKGNsYXp6KSkge1xuICAgICAgICAgICAgcmV0dXJuIDxUPm5ldyAoPENvbXBvbmVudENsYXNzPmNsYXp6KShjb25maWcgfHwge30pO1xuICAgICAgICB9IGVsc2UgaWYgKGNsYXp6ICE9PSBudWxsICYmIGNsYXp6ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIChjbGF6eikgPT09IFwib2JqZWN0XCIgJiYgKDxDb21wb25lbnRDb25maWc+Y2xhenopLmN0eXBlKSB7XG4gICAgICAgICAgICB2YXIgY3R5cGUgPSAoPENvbXBvbmVudENvbmZpZz5jbGF6eikuY3R5cGU7XG4gICAgICAgICAgICBkZWxldGUgKCg8Q29tcG9uZW50Q29uZmlnPmNsYXp6KS5jdHlwZSk7XG4gICAgICAgICAgICByZXR1cm4gQmxlbmQuY3JlYXRlQ29tcG9uZW50PFQ+KGN0eXBlLCBCbGVuZC5hcHBseShjbGF6eiwgY29uZmlnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBjcmVhdGUgYW4gb2JqZWN0IGZyb20gJHtjbGF6en1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBpc0NsYXNzKGNsYXp6OiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiAoY2xhenopID09PSBcImZ1bmN0aW9uXCIgJiYgISFPYmplY3Qua2V5cygoPGFueT5jbGF6eikucHJvdG90eXBlKS5sZW5ndGggPT09IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgY2xhc3Mgd2l0aCBhIGdpdmVuIGFsaWFzIGludG8gdGhlIGNsYXNzIHJlZ2lzdHJ5IHNvIHdlIGNhblxuICAgICAqIGluc3RhbnRpYXRlIGFuIG9iamVjdCB3aXRoIGNyZWF0ZU9iamVjdFdpdGhBbGlhcy5cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDbGFzc1dpdGhBbGlhcyhhbGlhczogc3RyaW5nLCBjbGF6ejogQ29tcG9uZW50Q2xhc3MpIHtcbiAgICAgICAgaWYgKCFyZWdpc3RyeVthbGlhc10pIHtcbiAgICAgICAgICAgIEJsZW5kLnJlZ2lzdHJ5W2FsaWFzXSA9IGNsYXp6O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIENsYXNzIHdpdGggYWxpYXMgJHthbGlhc30gaXMgYWxyZWFkeSByZWdpc3RlcmVkIWApO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIEJsZW5kIHtcbiAgICBleHBvcnQgdmFyIHZlcnNpb24gPSBcInY0LjAuMFwiO1xufSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgVHJ1ZVNvZnR3YXJlIEIuVi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9CbGVuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQ29tcG9uZW50LnRzXCIgLz5cblxubmFtZXNwYWNlIEJsZW5kLmFqYXgge1xuXG4gICAgLyoqXG4gICAgICogQmFzZSBjbGFzcyBmb3IgYW4gQWpheCBSZXF1ZXN0XG4gICAgICovXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFqYXhSZXF1ZXN0IGV4dGVuZHMgQmxlbmQuQ29tcG9uZW50IHtcblxuICAgICAgICBwcm90ZWN0ZWQgeGhyOiBYTUxIdHRwUmVxdWVzdDtcbiAgICAgICAgcHJvdGVjdGVkIHhockNvbmZpZzogRGljdGlvbmFyeUludGVyZmFjZTtcbiAgICAgICAgcHJvdGVjdGVkIHVybDogc3RyaW5nO1xuICAgICAgICBwcm90ZWN0ZWQgaGVhZGVyczogRGljdGlvbmFyeUludGVyZmFjZTtcbiAgICAgICAgcHJvdGVjdGVkIG9uQ29tcGxldGU6IEZ1bmN0aW9uO1xuICAgICAgICBwcm90ZWN0ZWQgb25Qcm9ncmVzczogRnVuY3Rpb247XG4gICAgICAgIHByb3RlY3RlZCBvbkZhaWxlZDogRnVuY3Rpb247XG4gICAgICAgIHByb3RlY3RlZCBvblN1Y2Nlc3M6IEZ1bmN0aW9uO1xuICAgICAgICBwcm90ZWN0ZWQgb25TdGFydDogRnVuY3Rpb247XG4gICAgICAgIHByb3RlY3RlZCBvblByZXBhcmVVcGxvYWQ6IEZ1bmN0aW9uO1xuICAgICAgICBwcm90ZWN0ZWQgc2NvcGU6IGFueTtcbiAgICAgICAgcHJvdGVjdGVkIGNhbGxJRDogbnVtYmVyO1xuXG4gICAgICAgIHByb3RlY3RlZCBhYnN0cmFjdCBkb1NlbmRSZXF1ZXN0KGRhdGE6IERpY3Rpb25hcnlJbnRlcmZhY2UpOiB2b2lkXG5cbiAgICAgICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbmZpZzogc3RyaW5nIHwgQWpheFJlcXVlc3RJbnRlcmZhY2UpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLCBjZmc6IEFqYXhSZXF1ZXN0SW50ZXJmYWNlO1xuICAgICAgICAgICAgaWYgKEJsZW5kLmlzU3RyaW5nKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjZmcgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogPHN0cmluZz5jb25maWcgfHwgbnVsbFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNmZyA9IDxBamF4UmVxdWVzdEludGVyZmFjZT5jb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZS51cmwgPSBjZmcudXJsIHx8IG51bGw7XG4gICAgICAgICAgICBtZS5oZWFkZXJzID0gY2ZnLmhlYWRlcnMgfHwge307XG4gICAgICAgICAgICBtZS5vbkNvbXBsZXRlID0gY2ZnLm9uQ29tcGxldGUgfHwgbnVsbDtcbiAgICAgICAgICAgIG1lLm9uUHJvZ3Jlc3MgPSBjZmcub25Qcm9ncmVzcyB8fCBudWxsO1xuICAgICAgICAgICAgbWUub25GYWlsZWQgPSBjZmcub25GYWlsZWQgfHwgbnVsbDtcbiAgICAgICAgICAgIG1lLm9uU3VjY2VzcyA9IGNmZy5vblN1Y2Nlc3MgfHwgbnVsbDtcbiAgICAgICAgICAgIG1lLm9uU3RhcnQgPSBjZmcub25TdGFydCB8fCBudWxsO1xuICAgICAgICAgICAgbWUub25QcmVwYXJlVXBsb2FkID0gY2ZnLm9uUHJlcGFyZVVwbG9hZCB8fCBudWxsO1xuICAgICAgICAgICAgbWUuc2NvcGUgPSBjZmcuc2NvcGUgfCA8YW55Pm1lO1xuICAgICAgICAgICAgbWUueGhyQ29uZmlnID0ge1xuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogY2ZnLndpdGhDcmVkZW50aWFscyA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG1lLmluaXRpYWxpemUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBpbml0aWFsaXplKCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcywgaGFuZGxlcnM6IERpY3Rpb25hcnlJbnRlcmZhY2UgPSB7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IG1lLnVwZGF0ZVByb2dyZXNzLFxuICAgICAgICAgICAgICAgIGxvYWQ6IG1lLnRyYW5zZmVyQ29tcGxldGUsXG4gICAgICAgICAgICAgICAgZXJyb3I6IG1lLnRyYW5zZmVyRmFpbGVkLFxuICAgICAgICAgICAgICAgIGFib3J0OiBtZS50cmFuc2ZlckNhbmNlbGVkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbWUueGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICBCbGVuZC5mb3JFYWNoKGhhbmRsZXJzLCBmdW5jdGlvbihoYW5kbGVyOiBGdW5jdGlvbiwgZXZlbnROYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBtZS54aHIuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uKGV2dDogRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5hcHBseShtZSwgW21lLnhociwgZXZ0XSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEJsZW5kLmZvckVhY2gobWUuaGVhZGVycywgZnVuY3Rpb24odmFsdWU6IHN0cmluZywgaGVhZGVyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBtZS54aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQmxlbmQuZm9yRWFjaChtZS54aHJDb25maWcsIGZ1bmN0aW9uKHZhbHVlOiBhbnksIGtleTogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgKDxhbnk+bWUueGhyKVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZW5kUmVxdWVzdChkYXRhOiBEaWN0aW9uYXJ5SW50ZXJmYWNlID0ge30pIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5jYWxsSUQgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKG1lLmNhbGxIYW5kbGVyKFwib25TdGFydFwiLCBhcmd1bWVudHMpICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIG1lLmRvU2VuZFJlcXVlc3QoZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lLnRyYW5zZmVyQ2FuY2VsZWQobWUueGhyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCB1cGRhdGVQcm9ncmVzcyhyZXF1ZXN0OiBYTUxIdHRwUmVxdWVzdCwgZXZ0OiBFdmVudCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmNhbGxIYW5kbGVyKFwib25Qcm9ncmVzc1wiLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHRyYW5zZmVyQ29tcGxldGUocmVxdWVzdDogWE1MSHR0cFJlcXVlc3QsIGV2dDogRXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPj0gMzAwKSB7XG4gICAgICAgICAgICAgICAgbWUudHJhbnNmZXJGYWlsZWQuYXBwbHkobWUsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgICAgbWUuY2FsbEhhbmRsZXIoXCJvblN1Y2Nlc3NcIiwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lLmNhbGxIYW5kbGVyKFwib25Db21wbGV0ZVwiLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHRyYW5zZmVyRmFpbGVkKHJlcXVlc3Q6IFhNTEh0dHBSZXF1ZXN0LCBldnQ6IEV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUuY2FsbEhhbmRsZXIoXCJvbkZhaWxlZFwiLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHRyYW5zZmVyQ2FuY2VsZWQocmVxdWVzdDogWE1MSHR0cFJlcXVlc3QsIGV2dDogRXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS50cmFuc2ZlckZhaWxlZChyZXF1ZXN0LCBldnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbGUgcHJlcGFyZSBldmVudCBub3RpZmljYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBub3RpZnlQcmVwYXJlVXBsb2FkKGZpbGU6IEZpbGUsIHN0YXR1czogbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGxIYW5kbGVyKFwib25QcmVwYXJlVXBsb2FkXCIsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FsbHMgYSByZWdpc3RlcmVuZCBoYW5kbGVyIGJ5IG5hbWVcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgY2FsbEhhbmRsZXIobmFtZTogc3RyaW5nLCBhcmdzOiBJQXJndW1lbnRzKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCg8YW55Pm1lKVtuYW1lXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoPEZ1bmN0aW9uPig8YW55Pm1lKVtuYW1lXSkuYXBwbHkobWUuc2NvcGUgfHwgbWUsIGFyZ3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVSSSBlbmNvZGUgYSBzdHJpbmcgdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBlbmNvZGVVUklDb21wb25lbnQodmFsdWU6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkucmVwbGFjZSgvWyEnKCkqXS9nLCBmdW5jdGlvbihjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiJVwiICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVSTCBlbmNvZGUgYSBEaWN0aW9uYXJ5XG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgdXJsRW5jb2RlRGF0YShkYXRhOiBEaWN0aW9uYXJ5SW50ZXJmYWNlKTogc3RyaW5nIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsIHBheWxvYWQ6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgICAgIEJsZW5kLmZvckVhY2goZGF0YSwgZnVuY3Rpb24odmFsdWU6IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLnB1c2goYCR7a2V5fT0ke21lLmVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSl9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkLmpvaW4oXCImXCIpLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGVzIG9yIHVwZGF0ZXMgdGhlIGN1cnJlbnQgVVJMIGJ5IGFkZGluZyBhIGNhbGwgSUQgdGkgYnlwYXNzIGJyb3dzZXIgY2FjaGluZ1xuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZVVSSShkYXRhOiBEaWN0aW9uYXJ5SW50ZXJmYWNlID0ge30pIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgICAgIGRhdGFbXCJfY1wiXSA9IG1lLmNhbGxJRDtcbiAgICAgICAgICAgIHJldHVybiAobWUudXJsXG4gICAgICAgICAgICAgICAgKyAobWUudXJsLmluZGV4T2YoXCI/XCIpID09PSAtMSA/IFwiP1wiIDogXCImXCIpXG4gICAgICAgICAgICAgICAgKyBtZS51cmxFbmNvZGVEYXRhKGRhdGEpKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0JsZW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBamF4UmVxdWVzdC50c1wiIC8+XG5cbm5hbWVzcGFjZSBCbGVuZC5hamF4IHtcblxuICAgIC8qKlxuICAgICAqIEFqYXhHZXRSZXF1ZXN0IGltcGxlbWVudHMgYSBHRVQgcmVxdWVzdFxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBBamF4R2V0UmVxdWVzdCBleHRlbmRzIEJsZW5kLmFqYXguQWpheFJlcXVlc3Qge1xuXG4gICAgICAgIHByb3RlY3RlZCBkb1NlbmRSZXF1ZXN0KGRhdGE6IERpY3Rpb25hcnlJbnRlcmZhY2UgPSB7fSkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLnhoci5vcGVuKFwiR0VUXCIsIG1lLmNyZWF0ZVVSSShkYXRhKSwgdHJ1ZSk7XG4gICAgICAgICAgICBtZS54aHIuc2VuZChudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IFRydWVTb2Z0d2FyZSBCLlYuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQmxlbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkFqYXhSZXF1ZXN0LnRzXCIgLz5cblxubmFtZXNwYWNlIEJsZW5kLmFqYXgge1xuXG4gICAgLyoqXG4gICAgICogQWpheFBvc3RSZXF1ZXN0IGltcGxlbWVudHMgYSBQT1NUIHJlcXVlc3Qgd2l0aCBGaWxlIHVwbG9hZGluZyBjYXBhYmlsaXRpZXNcbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgQWpheFBvc3RSZXF1ZXN0IGV4dGVuZHMgQmxlbmQuYWpheC5BamF4UmVxdWVzdCB7XG5cbiAgICAgICAgcHJvdGVjdGVkIGJvdW5kYXJ5OiBzdHJpbmc7XG4gICAgICAgIHByb3RlY3RlZCBkYXRhSXRlbUhlYWRlcjogc3RyaW5nO1xuICAgICAgICBwcm90ZWN0ZWQgcmVhZHlUb1NlbmQ6IGJvb2xlYW47XG5cbiAgICAgICAgcHJvdGVjdGVkIGRvU2VuZFJlcXVlc3QoZGF0YTogRGljdGlvbmFyeUludGVyZmFjZSA9IHt9KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUucmVhZHlUb1NlbmQgPSB0cnVlO1xuICAgICAgICAgICAgbWUuYm91bmRhcnkgPSBcIiEhQEAjI1wiICsgbWUuY2FsbElEICsgXCIjI0BAISFcIjtcbiAgICAgICAgICAgIG1lLmRhdGFJdGVtSGVhZGVyID0gYC0tJHttZS5ib3VuZGFyeX1cXHJcXG5Db250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7YDtcbiAgICAgICAgICAgIG1lLnhoci5vcGVuKFwiUE9TVFwiLCBtZS5jcmVhdGVVUkkoKSwgdHJ1ZSk7XG4gICAgICAgICAgICBtZS54aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcIm11bHRpcGFydFxcL2Zvcm0tZGF0YTsgYm91bmRhcnk9XCIgKyBtZS5ib3VuZGFyeSk7XG4gICAgICAgICAgICBtZS5ib3VuZGFyeUVuY29kZURhdGEoZGF0YSwgZnVuY3Rpb24oZW5jb2RlZERhdGE6IHN0cmluZykge1xuICAgICAgICAgICAgICAgIG1lLnhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1MZW5ndGhcIiwgZW5jb2RlZERhdGEubGVuZ3RoLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIG1lLnhoci5zZW5kQXNCaW5hcnkoZW5jb2RlZERhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRW5jb2RlIHRoZSBkYXRhIHRoYXQgaXMgdG8gYmUgc2VudCAoUE9TVCkgYXN5bmNocm9ub3VzbHlcbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBib3VuZGFyeUVuY29kZURhdGEoZGF0YTogRGljdGlvbmFyeUludGVyZmFjZSwgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHBlbmRpbmdDb252ZXJ0czogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgICAgICAgICBCbGVuZC5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKHZhbHVlOiBhbnksIGtleTogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKEJsZW5kLmlzSW5zdGFuY2VPZih2YWx1ZSwgRmlsZUxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdDb252ZXJ0cyArPSBtZS5lbmNvZGVGaWxlTGlzdCg8RmlsZUxpc3Q+dmFsdWUsIHBheWxvYWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVuZGluZ0NvbnZlcnRzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQucHVzaChtZS5lbmNvZGVEYXRhSXRlbShrZXksIHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgd2FpdElkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdDb252ZXJ0cyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHdhaXRJZCk7XG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQucHVzaChgLS0ke21lLmJvdW5kYXJ5fS0tXFxyXFxuYCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG1lLCBbcGF5bG9hZC5qb2luKFwiXCIpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb252ZXJ0cyBhbiBBcnJheUJ1ZmZlciAoRmlsZSkgdG8gYSBzdHJpbmdcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgYXJyYXlCdWZmZXJUb1N0cmluZyA9IGZ1bmN0aW9uKHJlc3VsdDogQXJyYXk8bnVtYmVyPik6IHN0cmluZyB7XG4gICAgICAgICAgICB2YXIgYmluYXJ5ID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KHJlc3VsdCk7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gYnl0ZXMuYnl0ZUxlbmd0aDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYmluYXJ5O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbmNvZGVzIGEgRmlsZUxpc3RcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgZW5jb2RlRmlsZUxpc3QoZmlsZXM6IEZpbGVMaXN0LCBwYXlsb2FkOiBBcnJheTxzdHJpbmc+LCBvbkZpbmlzaDogRnVuY3Rpb24pOiBudW1iZXIge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgICAgICBjdXJyZW50RmlsZTogRmlsZSxcbiAgICAgICAgICAgICAgICBmaWxldHlwZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgIG5leHRGaWxlOiBudW1iZXIgPSAwLFxuICAgICAgICAgICAgICAgIHJlYWRlcjogRmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZ0OiBFdmVudCkge1xuICAgICAgICAgICAgICAgIGZpbGV0eXBlID0gY3VycmVudEZpbGUudHlwZSA9PT0gXCJcIiA/IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIgOiBjdXJyZW50RmlsZS50eXBlO1xuICAgICAgICAgICAgICAgIHBheWxvYWQucHVzaChgJHttZS5kYXRhSXRlbUhlYWRlcn0gbmFtZT1cIiR7Y3VycmVudEZpbGUubmFtZX1cIjsgZmlsZW5hbWU9XCIke2N1cnJlbnRGaWxlLm5hbWV9XCJcXHJcXG5Db250ZW50LVR5cGU6ICR7ZmlsZXR5cGV9XFxyXFxuXFxyXFxuJHttZS5hcnJheUJ1ZmZlclRvU3RyaW5nKHJlYWRlci5yZXN1bHQpfVxcclxcbmApO1xuICAgICAgICAgICAgICAgIG9uRmluaXNoLmFwcGx5KG1lLCBbXSk7XG4gICAgICAgICAgICAgICAgbWUubm90aWZ5UHJlcGFyZVVwbG9hZChjdXJyZW50RmlsZSwgMik7XG4gICAgICAgICAgICAgICAgbmV4dEZpbGUgKz0gMTtcbiAgICAgICAgICAgICAgICBkb1dvcmsoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWFkZXIub25wcm9ncmVzcyA9IGZ1bmN0aW9uKGV2dDogRXZlbnQpIHtcbiAgICAgICAgICAgICAgICBtZS5ub3RpZnlQcmVwYXJlVXBsb2FkKGN1cnJlbnRGaWxlLCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgZG9Xb3JrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVzW25leHRGaWxlXSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RmlsZSA9IGZpbGVzW25leHRGaWxlXTtcbiAgICAgICAgICAgICAgICAgICAgbWUubm90aWZ5UHJlcGFyZVVwbG9hZChjdXJyZW50RmlsZSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihjdXJyZW50RmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRvV29yaygpO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVzLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbmNvZGVzIHNpbXBsZSBkYXRhIGl0ZW1zXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGVuY29kZURhdGFJdGVtKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGAke21lLmRhdGFJdGVtSGVhZGVyfSBuYW1lPVwiJHtrZXl9XCJcXHJcXG5cXHJcXG4ke3ZhbHVlfVxcclxcbmA7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1R5cGluZ3MudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0JsZW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9Db21wb25lbnQudHNcIiAvPlxuXG5uYW1lc3BhY2UgQmxlbmQubXZjIHtcblxuICAgIC8qKlxuICAgICAqIEFic3RyYWN0IGNsYXNzIHByb3ZpZGluZyBjb250cm9sbGVyIHJlZ3NpdGVyYXRpb24gYW5kIGV2ZW50IHB1Ymxpc2hpbmdcbiAgICAgKiBUaGlzIGNsYXNzIGlzIHRoZSBiYXNlIGNsYXNzIGZvciBWaWV3IGFuZCB0aGUgQ29udGV4dFxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBDbGllbnQgZXh0ZW5kcyBCbGVuZC5Db21wb25lbnQge1xuXG4gICAgICAgIHByb3RlY3RlZCBjb250cm9sbGVyczogQXJyYXk8QmxlbmQubXZjLkNvbnRyb2xsZXI+O1xuXG4gICAgICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IE12Y0NsaWVudEludGVyZmFjZSA9IHt9KSB7XG4gICAgICAgICAgICBzdXBlcihjb25maWcpO1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmNvbnRyb2xsZXJzID0gW107XG4gICAgICAgICAgICBtZS5hZGRDb250cm9sbGVyKGNvbmZpZy5jb250cm9sbGVyIHx8IFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaXJlcyBhbiBldmVudCB0b3dhcmRzIHRoZSBDb250cm9sbGVycyB3aXRoaW4gdGhpcyBWaWV3XG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgZmlyZUV2ZW50V2l0aFNjb3BlKHNjb3BlOiBhbnksIGV2ZW50TmFtZTogc3RyaW5nLCBhcmdzOiBBcnJheTxhbnk+KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKG1lLmNvbnRyb2xsZXJzKSB7XG4gICAgICAgICAgICAgICAgQmxlbmQuZm9yRWFjaChtZS5jb250cm9sbGVycywgZnVuY3Rpb24oY29udHJvbGxlcjogQ29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJvbGxlci5kZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlci5kZWxlZ2F0ZShldmVudE5hbWUsIHNjb3BlLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICg8YW55PmNvbnRyb2xsZXIpLmFwcGx5KHNjb3BlLCBbc2NvcGUsIGV2ZW50TmFtZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZHMgKHJlZ2lzdGVycykgQ29udHJvbGxlcnMgd2l0aCB0aGlzIGNsaWVudFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGFkZENvbnRyb2xsZXIoY29udHJvbGxlcnM6IENvbnRyb2xsZXJUeXBlIHwgQXJyYXk8Q29udHJvbGxlclR5cGU+KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGN0cmw6IENvbnRyb2xsZXI7XG4gICAgICAgICAgICBCbGVuZC5mb3JFYWNoKEJsZW5kLndyYXBJbkFycmF5KGNvbnRyb2xsZXJzKSwgZnVuY3Rpb24oaXRlbTogQ29udHJvbGxlclR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoQmxlbmQuaXNDbGFzcyhpdGVtKSB8fCBCbGVuZC5pc1N0cmluZyhpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHJsID0gPENvbnRyb2xsZXI+QmxlbmQuY3JlYXRlQ29tcG9uZW50KGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQmxlbmQuaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3RybCA9IDxDb250cm9sbGVyPml0ZW07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChCbGVuZC5pc0Z1bmN0aW9uKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0cmwgPSA8YW55Pml0ZW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChCbGVuZC5pc0luc3RhbmNlT2YoY3RybCwgQmxlbmQubXZjLkNvbnRyb2xsZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0cmwuYmluZFZpZXcobWUpO1xuICAgICAgICAgICAgICAgICAgICBtZS5jb250cm9sbGVycy5wdXNoKGN0cmwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQmxlbmQuaXNGdW5jdGlvbihjdHJsKSkge1xuICAgICAgICAgICAgICAgICAgICBtZS5jb250cm9sbGVycy5wdXNoKDxhbnk+ZnVuY3Rpb24oKSB7IHJldHVybiAoPGFueT5jdHJsKS5hcHBseShtZSwgYXJndW1lbnRzKTsgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2N0cmx9IGlzIG5vdCBhIHZhbGlkIEJsZW5kLm12Yy5Db250cm9sbGVyYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1R5cGluZ3MudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0JsZW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnQudHNcIiAvPlxuXG5uYW1lc3BhY2UgQmxlbmQubXZjIHtcblxuICAgIGV4cG9ydCBjbGFzcyBWaWV3IGV4dGVuZHMgQmxlbmQubXZjLkNsaWVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSByZWZlcmVuY2U6IHN0cmluZztcbiAgICAgICAgcHJvdGVjdGVkIGNvbnRleHQ6IEJsZW5kLm12Yy5Db250ZXh0O1xuICAgICAgICBwcm90ZWN0ZWQgZXZlbnRzRW5hYmxlZDogYm9vbGVhbjtcbiAgICAgICAgcHJvdGVjdGVkIGN1cnJlbnRFdmVudE5hbWU6IHN0cmluZztcblxuICAgICAgICBwdWJsaWMgY29uc3RydWN0b3IoY29uZmlnOiBNdmNWaWV3SW50ZXJmYWNlID0ge30pIHtcbiAgICAgICAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUucmVmZXJlbmNlID0gY29uZmlnLnJlZmVyZW5jZSB8fCBudWxsO1xuICAgICAgICAgICAgbWUuY3VycmVudEV2ZW50TmFtZSA9IG51bGw7XG4gICAgICAgICAgICBtZS5zZXRDb250ZXh0KGNvbmZpZy5jb250ZXh0IHx8IG51bGwpO1xuICAgICAgICAgICAgbWUuZGlzYWJsZUV2ZW50cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIGdsb2JhbCBNVkMgY29udGV4dFxuICAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzZXRDb250ZXh0KGNvbnRleHQ6IEJsZW5kLm12Yy5Db250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIHRvIHNlZSBpZiB3ZSBoYXZlIGEgZ2xvYmFsIE1WQyBjb250ZXh0XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgaGFzQ29udGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiAhQmxlbmQuaXNOdWxsT3JVbmRlZih0aGlzLmNvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGVzIHRoZSBldmVudCBhbmQgbm90aWZpY2F0aW9uIG9uIHRoaXMgVmlld1xuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGRpc2FibGVFdmVudHMoKTogQmxlbmQubXZjLkNsaWVudCB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVuYWJsZXMgdGhlIGV2ZW50IGFuZCBub3RpZmljYXRpb24gb24gdGhpcyB2aWV3XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZW5hYmxlRXZlbnRzKCk6IEJsZW5kLm12Yy5DbGllbnQge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIHJlZmVyZW5jZSBpZGVudGlmaWVyIGZvciB0aGlzIFZpZXdcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRSZWZlcmVuY2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWZlcmVuY2UgfHwgbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjYW5GaXJlRXZlbnRzKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaXJlcyBhbiBldmVudCB0b3dhcmRzIHRoZSBDb250cm9sbGVycyB3aXRoaW4gdGhpcyBWaWV3XG4gICAgICAgICAqIGFuZCB0aGUgY3VycmVudCBnbG9iYWwgQ29udGV4dCBpcyBwb3NzaWJsZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGZpcmVFdmVudChldmVudE5hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pOiBCbGVuZC5tdmMuQ2xpZW50IHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5jdXJyZW50RXZlbnROYW1lID0gZXZlbnROYW1lO1xuICAgICAgICAgICAgaWYgKG1lLmNhbkZpcmVFdmVudHMoKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlyZUV2ZW50V2l0aFNjb3BlKG1lLCBldmVudE5hbWUsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGlmIChtZS5jb250ZXh0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lLmNvbnRleHQuZGVsZWdhdGUoZXZlbnROYW1lLCBtZSwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1R5cGluZ3MudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0NvbXBvbmVudC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiVmlldy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50LnRzXCIgLz5cblxuaW50ZXJmYWNlIENvbnRyb2xsZXJFdmVudEhhbmRsZXIge1xuICAgICh2aWV3OiBCbGVuZC5tdmMuVmlldywgLi4uYXJnczogYW55W10pOiB2b2lkO1xufVxuXG5uYW1lc3BhY2UgQmxlbmQubXZjIHtcblxuICAgIC8qKlxuICAgICAqIEJhc2UgY2xhc3MgZm9yIGEgQ29udHJvbGxlci5cbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgQ29udHJvbGxlciBleHRlbmRzIEJsZW5kLkNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSBoYW5kbGVyczogRGljdGlvbmFyeUludGVyZmFjZSA9IHt9O1xuXG4gICAgICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IGFueSA9IHt9KSB7XG4gICAgICAgICAgICBzdXBlcihjb25maWcpO1xuICAgICAgICAgICAgdGhpcy5pbml0RXZlbnRzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgaW5pdEV2ZW50cygpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBpbnRlcm5hbFxuICAgICAgICAgKiBEZWxlZ2F0ZXMgYW4gZXZlbnQgdG8gdGhlIHJlZ2lzcmV0ZWQgaGFuZGxlcnMgaW4gdGhpcyBjb250cm9sbGVyXG4gICAgICAgICAqL1xuICAgICAgICBkZWxlZ2F0ZShldmVudE5hbWU6IHN0cmluZywgdmlldzogQ2xpZW50LCBhcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2UgPSAoPGFueT52aWV3KS5nZXRSZWZlcmVuY2UgPyAoPGFueT52aWV3KS5nZXRSZWZlcmVuY2UoKSA6IFwiXCIsXG4gICAgICAgICAgICAgICAgaGFuZGxlcnMgPSBtZS5oYW5kbGVyc1tldmVudE5hbWVdIHx8IG1lLmhhbmRsZXJzW3JlZmVyZW5jZSArIFwiLlwiICsgZXZlbnROYW1lXSB8fCBudWxsO1xuICAgICAgICAgICAgaWYgKGhhbmRsZXJzICYmIGhhbmRsZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcjogQ29udHJvbGxlckV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmFwcGx5KG1lLCBbdmlld10uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIDIpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGhhbmRsZXIgd2l0aGluIHRoaXMgY29udHJvbGxlclxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIG9uKGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBDb250cm9sbGVyRXZlbnRIYW5kbGVyKTogdm9pZCB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFtZS5oYW5kbGVyc1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgbWUuaGFuZGxlcnNbZXZlbnROYW1lXSA9IFtoYW5kbGVyXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWUuaGFuZGxlcnNbZXZlbnROYW1lXS5wdXNoKGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBpbnRlcm5hbFxuICAgICAgICAgKiBSZWdpc3RlcnMgYSBWaWV3J3MgcmVmZXJlbmNlIHdpdGhpbiB0aGlzIGNvbnRyb2xsZXJcbiAgICAgICAgICovXG4gICAgICAgIGJpbmRWaWV3KHZpZXc6IENsaWVudCB8IFZpZXcpOiB2b2lkIHtcbiAgICAgICAgICAgIHZhciBtZTogYW55ID0gdGhpcyxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2UgPSAoKDxWaWV3PnZpZXcpLmdldFJlZmVyZW5jZSA/ICg8Vmlldz52aWV3KS5nZXRSZWZlcmVuY2UoKSA6IG51bGwpOyAvLyB0cmljayB0byBieXBhc3MgdGhlIENvbnRleHQgb2JqZWN0XG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1lW3JlZmVyZW5jZV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVbcmVmZXJlbmNlXSA9IHZpZXc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChCbGVuZC5pc0FycmF5KG1lW3JlZmVyZW5jZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICg8QXJyYXk8QmxlbmQubXZjLlZpZXc+Pm1lW3JlZmVyZW5jZV0pLnB1c2goPFZpZXc+dmlldyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1R5cGluZ3MudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0JsZW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb250cm9sbGVyLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnQudHNcIiAvPlxuXG5cblxubmFtZXNwYWNlIEJsZW5kLm12YyB7XG5cbiAgICAvKipcbiAgICAgKiBSZXByZXNlbnRzIGEgY29udGV4dCB0aGF0IGhvbHMgaW5zdGFuc2VzIG9mIGNvbnRyb2xsZXJzIGFuIG90aGVyXG4gICAgICogIG12YyByZWxhdGVkIHN0YXRlXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIENvbnRleHQgZXh0ZW5kcyBCbGVuZC5tdmMuQ2xpZW50IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVsZWdhdGVzIGFuIGV2ZW50IHRvIHRoZSBDb250cm9sbGVycyB3aXRoaW4gdGhpcyBDb250ZXh0XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZGVsZWdhdGUoZXZlbnROYW1lOiBzdHJpbmcsIHNlbmRlcjogQ2xpZW50LCBhcmdzOiBBcnJheTxhbnk+KSB7XG4gICAgICAgICAgICB0aGlzLmZpcmVFdmVudFdpdGhTY29wZShzZW5kZXIsIGV2ZW50TmFtZSwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgVHJ1ZVNvZnR3YXJlIEIuVi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9tdmMvVmlldy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZG9tL0VsZW1lbnQudHNcIiAvPlxuXG5uYW1lc3BhY2UgQmxlbmQubWF0ZXJpYWwge1xuXG4gICAgLyoqXG4gICAgICogQWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgYSBNYXRlcmlhbFxuICAgICAqL1xuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRlcmlhbCBleHRlbmRzIEJsZW5kLm12Yy5WaWV3IHtcblxuICAgICAgICBwcm90ZWN0ZWQgcGFyZW50OiBCbGVuZC5tYXRlcmlhbC5NYXRlcmlhbDtcbiAgICAgICAgcHJvdGVjdGVkIGVsZW1lbnQ6IEJsZW5kLmRvbS5FbGVtZW50O1xuICAgICAgICBwcm90ZWN0ZWQgaXNSZW5kZXJlZDogYm9vbGVhbjtcbiAgICAgICAgcHJvdGVjdGVkIHZpc2libGU6IGJvb2xlYW47XG4gICAgICAgIHByb3RlY3RlZCBjb25maWc6IE1hdGVyaWFsSW50ZXJmYWNlO1xuICAgICAgICBwcm90ZWN0ZWQgdXNlUGFyZW50Q29udHJvbGxlcnM6IGJvb2xlYW47XG4gICAgICAgIHByb3RlY3RlZCBpc0luaXRpYWxpemVkOiBib29sZWFuO1xuICAgICAgICBwcm90ZWN0ZWQgY2FuTGF5b3V0OiBib29sZWFuO1xuXG4gICAgICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IE1hdGVyaWFsSW50ZXJmYWNlID0ge30pIHtcbiAgICAgICAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUuaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgICAgICAgICAgbWUucGFyZW50ID0gY29uZmlnLnBhcmVudCB8fCBudWxsO1xuICAgICAgICAgICAgbWUudXNlUGFyZW50Q29udHJvbGxlcnMgPSBjb25maWcudXNlUGFyZW50Q29udHJvbGxlciB8fCBmYWxzZTtcbiAgICAgICAgICAgIG1lLmlzUmVuZGVyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIG1lLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgbWUuY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGNzczogW10sXG4gICAgICAgICAgICAgICAgc3R5bGU6IHt9LFxuICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdG9wOiBudWxsLFxuICAgICAgICAgICAgICAgIGxlZnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgd2lkdGg6IG51bGwsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBudWxsLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IGNvbmZpZy5yZXNwb25zaXZlIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlVG86IGNvbmZpZy5yZXNwb25zZVRvIHx8IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBtZS5hZGRDc3NDbGFzcyhjb25maWcuY3NzIHx8IFtdKTtcbiAgICAgICAgICAgIG1lLnNldFN0eWxlKGNvbmZpZy5zdHlsZSB8fCB7fSk7XG4gICAgICAgICAgICBtZS5zZXRWaXNpYmxlKEJsZW5kLmlzQm9vbGVhbihjb25maWcudmlzaWJsZSkgPyBjb25maWcudmlzaWJsZSA6IG1lLnZpc2libGUpO1xuICAgICAgICAgICAgbWUuc2V0Qm91bmRzKHtcbiAgICAgICAgICAgICAgICB0b3A6IGNvbmZpZy50b3AgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICBsZWZ0OiBjb25maWcubGVmdCB8fCBudWxsLFxuICAgICAgICAgICAgICAgIHdpZHRoOiBjb25maWcud2lkdGggfHwgbnVsbCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGNvbmZpZy5oZWlnaHQgfHwgbnVsbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtZS5pbml0aWFsaXplUmVzcG9uc2l2ZUV2ZW50cygpO1xuICAgICAgICAgICAgbWUuY2FuTGF5b3V0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBpbml0aWF0aW5nIGEgc3ViLWxheW91dCBwcm9jZXNzLiBUaGlzIGZ1bmN0aW9uIGNhbiBiZVxuICAgICAgICAgKiBvdmVycmlkZGVuIHdoZW4gaW1wbGVtZW50aW5nIGEgY3VzdG9tIGNvbXBvbmVudC4gU2VlIHRoZSBCdXR0b24gY29tcG9uZW50IGFzXG4gICAgICAgICAqIGFuIGV4YW1wbGUgb2YgaG93IHRvIHVzZSB0aGlzIGZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlTGF5b3V0KCkge1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYXRlcyBhIHN1Yi1sYXlvdXQgcHJvY2Vzcy5cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBwZXJmb3JtTGF5b3V0KCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIGlmIChtZS5jYW5MYXlvdXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBtZS5zdXNwZW5kTGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgbWUudXBkYXRlTGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgbWUucmVzdW1lTGF5b3V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU3VzcGVuZHMgdGhlIHN1Yi1sYXlvdXQgZnJvbSBzdGFyaW5nXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgc3VzcGVuZExheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuY2FuTGF5b3V0ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzdW1lcyB0aGUgc3ViLWxheW91dFxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIHJlc3VtZUxheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuY2FuTGF5b3V0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgaW50ZXJuYWxseSBvbiByZW5kZXIgdGltZSB0byBhc3NpZ24gZWxlbWVudCBJRHMgdG9cbiAgICAgICAgICogcHJvcGVydGllc1xuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIGFzc2lnbkVsZW1lbnRCeU9JRChlbDogQmxlbmQuZG9tLkVsZW1lbnQsIG9pZDogc3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgbWU6IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAobWVbb2lkXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG1lW29pZF0gPSBlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplZCBhIHJlc3BvbnNpdmUgbGlzdGVuZXIgZm9yIHRoaXMgTWF0ZXJpYWwgYnkgYWRkaW5nIGEgbGlzdGVuZXIgdG8gdGhlXG4gICAgICAgICAqIFJ1bnRpbWUuYWRkTWVkaWFRdWVyeUxpc3RlbmVyXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZVJlc3BvbnNpdmVFdmVudHMoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLCBjb25maWc6IE1lZGlhUXVlcnlDb25maWc7XG5cbiAgICAgICAgICAgIGNvbmZpZyA9IG1lLmNvbmZpZy5yZXNwb25zaXZlID09PSB0cnVlID8gQmxlbmQuQ09NTU9OX01FRElBX1FVRVJJRVNcbiAgICAgICAgICAgICAgICA6IG1lLmNvbmZpZy5yZXNwb25zZVRvIHx8IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBCbGVuZC5mb3JFYWNoKGNvbmZpZywgZnVuY3Rpb24ocXVlcmllczogQXJyYXk8c3RyaW5nPiwgYWxpYXM6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBxdWVyaWVzID0gQmxlbmQud3JhcEluQXJyYXk8c3RyaW5nPihxdWVyaWVzKTtcbiAgICAgICAgICAgICAgICAgICAgcXVlcmllcy5mb3JFYWNoKGZ1bmN0aW9uKG1lZGlhUXVlcnk6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgQmxlbmQuUnVudGltZS5hZGRNZWRpYVF1ZXJ5TGlzdGVuZXIobWVkaWFRdWVyeSwgZnVuY3Rpb24obXFsOiBNZWRpYVF1ZXJ5TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLmZpcmVFdmVudChcInJlc3BvbnNpdmVDaGFuZ2VkXCIsIGFsaWFzLCBtcWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldFByb3BlcnR5PFQ+KG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsKTogVCB7XG4gICAgICAgICAgICB2YXIgbWU6IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAobmFtZS5pbmRleE9mKFwiY29uZmlnLlwiLCAwKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoXCJjb25maWcuXCIsIFwiXCIpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKG1lLmNvbmZpZ1tuYW1lXSA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbHVlIDogbWUuY29uZmlnW25hbWVdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmdldFByb3BlcnR5PFQ+KG5hbWUsIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgcmVuZGVyKCk6IEJsZW5kLmRvbS5FbGVtZW50IHtcbiAgICAgICAgICAgIHJldHVybiBCbGVuZC5kb20uRWxlbWVudC5jcmVhdGUoe30pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmRzIGEgbWF0ZXJpYWxJbml0aWFsaXplZCBub3RpZmljYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBub3RpZnlNYXRlcmlhbEluaXRpYWxpemVkKCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmZpcmVFdmVudChcIm1hdGVyaWFsSW5pdGlhbGl6ZWRcIiwgbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERPIE5PVCBVU0UgVEhJUyBGVU5DVElPTiFcbiAgICAgICAgICogSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgYnkgdGhlIHBhcmVudC9ob3N0IHRvIGluaXRpYXRlXG4gICAgICAgICAqIHRoZSBpbml0aWFsaXphdGlvbiBwcm9jZXNzXG4gICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGRvSW5pdGlhbGl6ZSgpOiBCbGVuZC5tYXRlcmlhbC5NYXRlcmlhbCB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUuaW5pdEV2ZW50cygpO1xuICAgICAgICAgICAgbWUuaW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgbWUucGVyZm9ybUxheW91dCgpO1xuICAgICAgICAgICAgbWUubm90aWZ5TWF0ZXJpYWxJbml0aWFsaXplZCgpO1xuICAgICAgICAgICAgcmV0dXJuIG1lO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gY2FuIGJlIG92ZXJyaWRlbiB0byBkbyBjdXN0b20gaW5pdGlhbGl6YXRpb24gb24gdGhpcyBNYXRlcmlhbFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGluaXRpYWxpemUoKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPdmVycmlkZSB0aGlzIG1ldGhvZCBmb3IgY3JlYXRpbmcgZXZlbnQgbGlzdGVuZXJzIGZvciB0aGlzIE1hdGVyaWFsXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgaW5pdEV2ZW50cygpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIGV2ZW50cyBjYW4gYmUgZmlyZWQgb24gdGhpcyBNYXRlcmlhbFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGNhbkZpcmVFdmVudHMoKTogYm9vbGVhbiB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLCBzdGF0ZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGlmIChzdXBlci5jYW5GaXJlRXZlbnRzKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAobWUucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlID0gbWUucGFyZW50LmNhbkZpcmVFdmVudHMoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0YXRlID09PSBmYWxzZSAmJiBtZS5jdXJyZW50RXZlbnROYW1lID09PSBcIm1hdGVyaWFsSW5pdGlhbGl6ZWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vIEJPVU5EU1xuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGJvdW5kcyBvZiB0aGlzIE1hdGVyaWFsIGJhc2VkIG9uIHRoZSBFbGVtZW50Qm91bmRzSW50ZXJmYWNlIGludGVyZmFjZVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Qm91bmRzKCk6IEVsZW1lbnRCb3VuZHNJbnRlcmZhY2Uge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIGlmIChtZS5pc1JlbmRlcmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lLmVsZW1lbnQuZ2V0Qm91bmRzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIGJvdW5kcyBvZiB0aGlzIE1hdGVyaWFsIGJhc2VkIG9uIHRoZSBFbGVtZW50Qm91bmRzSW50ZXJmYWNlIGludGVyZmFjZVxuICAgICAgICAgKi9cbiAgICAgICAgc2V0Qm91bmRzKGJvdW5kczogRWxlbWVudEJvdW5kc0ludGVyZmFjZSk6IEJsZW5kLm1hdGVyaWFsLk1hdGVyaWFsIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsIG51bGxCb3VuZHM6IFN0eWxlSW50ZXJmYWNlID0geyB0b3A6IG51bGwsIGxlZnQ6IG51bGwsIHdpZHRoOiBudWxsLCBoZWlnaHQ6IG51bGwgfTtcbiAgICAgICAgICAgIGlmIChtZS5pc1JlbmRlcmVkKSB7XG4gICAgICAgICAgICAgICAgbWUuc2V0U3R5bGUoYm91bmRzID09PSBudWxsID8gbnVsbEJvdW5kcyA6IDxTdHlsZUludGVyZmFjZT5ib3VuZHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBCbGVuZC5hcHBseShtZS5jb25maWcsIGJvdW5kcyA9PT0gbnVsbCA/IG51bGxCb3VuZHMgOiBib3VuZHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWUubm90aWZ5Qm91bmRzQ2hhbmdlZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZHMgYm91bmRzQ2hhbmdlZCBub3RpZmljYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIG5vdGlmeUJvdW5kc0NoYW5nZWQoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKG1lLmlzUmVuZGVyZWQpIHtcbiAgICAgICAgICAgICAgICBtZS5maXJlRXZlbnQoXCJib3VuZHNDaGFuZ2VkXCIsIG1lLmdldEJvdW5kcygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBWSVNJQklMSVRZXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHZpc2liaWxpdHkgc3RhdGUgZm9yIHRoaXMgTWF0ZXJpYWxcbiAgICAgICAgICovXG4gICAgICAgIHNldFZpc2libGUodmlzaWJsZTogYm9vbGVhbiA9IHRydWUpOiBCbGVuZC5tYXRlcmlhbC5NYXRlcmlhbCB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUudmlzaWJsZSA9IHZpc2libGUgPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICBpZiAobWUuaXNSZW5kZXJlZCkge1xuICAgICAgICAgICAgICAgIG1lLmVsZW1lbnQuc2V0RGF0YShcInZpc2libGVcIiwgbWUudmlzaWJsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lLmNvbmZpZy52aXNpYmxlID0gbWUudmlzaWJsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lLm5vdGlmeVZpc2liaWxpdHlDaGFuZ2VkKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBnZXRzIHRoZSB2aXNpYmlsaXR5IHN0YXRlIG9mIHRoaXMgTWF0ZXJpYWxcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBpc1Zpc2libGUoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIG1lLnZpc2libGU7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZHMgYSB2aXNpYmlsaXR5Q2hhbmdlZCBub3RpZmljYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBub3RpZnlWaXNpYmlsaXR5Q2hhbmdlZCgpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5maXJlRXZlbnQoXCJ2aXNpYmlsaXR5Q2hhbmdlZFwiLCBtZS52aXNpYmxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gU1RZTEUgYW5kIENTU1xuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBTdHlsZXMgZm9yIHRoaXMgTWF0ZXJpYWxcbiAgICAgICAgICogKi9cbiAgICAgICAgcHVibGljIHNldFN0eWxlKHN0eWxlOiBTdHlsZUludGVyZmFjZSkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIGlmIChtZS5pc1JlbmRlcmVkKSB7XG4gICAgICAgICAgICAgICAgbWUuZWxlbWVudC5zZXRTdHlsZShzdHlsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIEJsZW5kLmFwcGx5KG1lLmNvbmZpZy5zdHlsZSwgc3R5bGUsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lLm5vdGlmeVN0eWxlT3JDU1NDaGFuZ2VkKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkcyBvbmUgb3IgbW9yZSBDU1MgY2xhc3NlcyB0byB0aGlzIE1hdGVyaWFsXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgYWRkQ3NzQ2xhc3MoY3NzOiBzdHJpbmcgfCBBcnJheTxzdHJpbmc+KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKG1lLmlzUmVuZGVyZWQpIHtcbiAgICAgICAgICAgICAgICBtZS5lbGVtZW50LmFkZENzc0NsYXNzKGNzcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIEJsZW5kLndyYXBJbkFycmF5KGNzcykuZm9yRWFjaChmdW5jdGlvbihpdG06IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICAoPEFycmF5PHN0cmluZz4+bWUuY29uZmlnLmNzcykucHVzaChpdG0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWUubm90aWZ5U3R5bGVPckNTU0NoYW5nZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZW5kcyBhIHZpc2liaWxpdHlDaGFuZ2VkIG5vdGlmaWNhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIG5vdGlmeVN0eWxlT3JDU1NDaGFuZ2VkKCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmZpcmVFdmVudChcInN0eWxlQ2hhbmdlZFwiLCBtZS52aXNpYmxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKkhlbHBzIGNvbmZpZ3VyaW5nIHRoZSB0aGlzIE1hdGVyaWFsIGJlZm9yZSB0aGUgcmVuZGVyaW5nIGN5Y2xlIGlzIGNvbXBsZXRlXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgZmluYWxpemVSZW5kZXIoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUuYWRkQ3NzQ2xhc3MobWUuY29uZmlnLmNzcyk7XG4gICAgICAgICAgICBtZS5zZXRCb3VuZHMoe1xuICAgICAgICAgICAgICAgIHRvcDogbWUuY29uZmlnLnRvcCxcbiAgICAgICAgICAgICAgICBsZWZ0OiBtZS5jb25maWcubGVmdCxcbiAgICAgICAgICAgICAgICB3aWR0aDogbWUuY29uZmlnLndpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogbWUuY29uZmlnLmhlaWdodFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtZS5zZXRTdHlsZShtZS5jb25maWcuc3R5bGUpO1xuICAgICAgICAgICAgaWYgKCFtZS52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgLy8gc2hvdWxkIGJlIHNldCBvbmx5IHdoZW4gbm90IHZpc2libGVcbiAgICAgICAgICAgICAgICBtZS5zZXRWaXNpYmxlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChCbGVuZC5ERUJVRyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IFwibVwiICsgQmxlbmQubmV3SUQoKTtcbiAgICAgICAgICAgICAgICBtZS5lbGVtZW50LmdldEVsKCkuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICAgICAgICAgICg8YW55PndpbmRvdylbaWRdID0gbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiBSZXRyaXZlcyB0aGUgSFRNTEVsZW1lbnQgZm9yIHRoaXMgTWF0ZXJpYWxcbiAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGdldEVsZW1lbnQoKTogQmxlbmQuZG9tLkVsZW1lbnQge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIGlmICghbWUuaXNSZW5kZXJlZCkge1xuICAgICAgICAgICAgICAgIG1lLmRpc2FibGVFdmVudHMoKTtcbiAgICAgICAgICAgICAgICBtZS5lbGVtZW50ID0gbWUucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgbWUuaXNSZW5kZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbWUuZmluYWxpemVSZW5kZXIoKTtcbiAgICAgICAgICAgICAgICBtZS5lbmFibGVFdmVudHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZS5lbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlc3Ryb3lzIHRoaXMgTWF0ZXJpYWwgYnkgc2V0dGluZyB0aGUgcHJvcGVydGllcyB0byBudWxsLFxuICAgICAgICAgKiBkZWxldGluZyB0aGVtIGFuZCByZW1vdmluZyBpdHMgSFRNTEVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBkZXN0cm95KCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICBCbGVuZC5mb3JFYWNoKG1lLCBmdW5jdGlvbih2YWx1ZTogYW55LCBrZXk6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICg8YW55Pm1lKVtrZXldID0gbnVsbDtcbiAgICAgICAgICAgICAgICBkZWxldGUgKCg8YW55Pm1lKVtrZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1R5cGluZ3MudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0JsZW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9kb20vRWxlbWVudC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbXZjL0NvbnRleHQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL21hdGVyaWFsL01hdGVyaWFsLnRzXCIgLz5cblxubmFtZXNwYWNlIEJsZW5kLmFwcGxpY2F0aW9uIHtcblxuICAgIC8qKlxuICAgICAqIEJhc2UgY2xhc3MgZm9yIGltcGxlbWVudGluZyBhbiBBcHBsaWNhdGlvbiBjb21wb25lbnRcbiAgICAgKi9cbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQXBwbGljYXRpb24gZXh0ZW5kcyBCbGVuZC5tYXRlcmlhbC5NYXRlcmlhbCB7XG5cbiAgICAgICAgcHJvdGVjdGVkIGNvbmZpZzogQXBwbGljYXRpb25JbnRlcmZhY2U7XG4gICAgICAgIHByb3RlY3RlZCBpc1N0YXJ0ZWQ6IGJvb2xlYW47XG4gICAgICAgIHByb3RlY3RlZCBpc1Jlc2l6aW5nOiBib29sZWFuO1xuICAgICAgICBwcm90ZWN0ZWQgbWFpblZpZXc6IEJsZW5kLm1hdGVyaWFsLk1hdGVyaWFsO1xuXG4gICAgICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IEFwcGxpY2F0aW9uSW50ZXJmYWNlID0ge30pIHtcbiAgICAgICAgICAgIHN1cGVyKEJsZW5kLmFwcGx5KGNvbmZpZywgPE1hdGVyaWFsSW50ZXJmYWNlPntcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUuaXNTdGFydGVkID0gZmFsc2U7XG4gICAgICAgICAgICBtZS5pc1Jlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBtZS5jb25maWcubWFpblZpZXcgPSBjb25maWcubWFpblZpZXcgfHwgbnVsbDtcbiAgICAgICAgICAgIG1lLmNvbmZpZy50aGVtZSA9IGNvbmZpZy50aGVtZSB8fCBcImRlZmF1bHRcIjtcbiAgICAgICAgICAgIG1lLmNvbmZpZy5zdHlsZSA9IHt9OyAvLyByZW1vdmUgdXNlIHByb3ZpZGVkIHN0eWxlc1xuICAgICAgICAgICAgbWUuc2V0Q29udGV4dChuZXcgQmxlbmQubXZjLkNvbnRleHQoKSk7XG4gICAgICAgICAgICBtZS5jcmVhdGVNYWluVmlldygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVzZWQgdG8gZmlyZSBhbiBldmVudCB3aGVuIHRoZSBicm93c2VyIGlzIHJlc2l6ZWRcbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBub3RpZnlBcHBsaWNhdGlvblJlc2l6ZWQoZXZ0OiBFdmVudCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmZpcmVFdmVudChcImFwcGxpY2F0aW9uUmVzaXplZFwiLCBldnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZSB0aGUgcmVzaXplIG5vdGlmaWNhdGlvbiBjb3JyZWN0bHlcbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoIW1lLmlzUmVzaXppbmcpIHtcbiAgICAgICAgICAgICAgICBtZS5pc1Jlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtZS5ub3RpZnlBcHBsaWNhdGlvblJlc2l6ZWQuYXBwbHkobWUsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgbWUuaXNSZXNpemluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbGwgYW4gZXZlbnQgbGlzdGVuZXIgb24gdGhlIHdpbmRvd1xuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIHNldHVwV2luZG93TGlzdGVuZXJzKCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcywgdG0gPSAtMSxcbiAgICAgICAgICAgICAgICBjb3VudHMgPSAwLFxuICAgICAgICAgICAgICAgIGN1clNpemUgPSAtMTtcbiAgICAgICAgICAgIEJsZW5kLlJ1bnRpbWUuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csIFwicmVzaXplXCIsIGZ1bmN0aW9uKGV2dDogRXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjdXJTaXplID0gd2luZG93LmlubmVyV2lkdGggKyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0bSk7XG4gICAgICAgICAgICAgICAgdG0gPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50cyA+PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyU2l6ZSA9PT0gKHdpbmRvdy5pbm5lcldpZHRoICsgaW5uZXJIZWlnaHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0bSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWUub25XaW5kb3dSZXNpemUuYXBwbHkobWUsIFtldnRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50cysrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlyZXMgd2hlbiB0aGUgYXBwbGljYXRpb24gaXMgcmVhZHkgZm9yIHVzZXIgaW50ZXJhY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBub3RpZnlBcHBsaWNhdGlvblJlYWR5KCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmZpcmVFdmVudChcImFwcGxpY2F0aW9uUmVhZHlcIik7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgcGVyZm9ybUluaXRpYWxNZWRpYVF1ZXJ5KCkge1xuICAgICAgICAgICAgQmxlbmQuUnVudGltZS50cmlnZ2VyTWVkaWFRdWVyeUNoZWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgYXN5bmNSdW4oKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGJvZHk6IEJsZW5kLmRvbS5FbGVtZW50ID0gQmxlbmQuZ2V0RWxlbWVudChkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgICAgIGlmICghbWUuaXNTdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgYm9keS5jbGVhckVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICBib2R5LmFkZENzc0NsYXNzKG1lLmNvbmZpZy50aGVtZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGJvZHkuYXBwZW5kKG1lLmdldEVsZW1lbnQoKSk7XG4gICAgICAgICAgICAgICAgbWUuc2V0dXBXaW5kb3dMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgICAgICBtZS5wZXJmb3JtSW5pdGlhbE1lZGlhUXVlcnkoKTtcbiAgICAgICAgICAgICAgICBtZS5kb0luaXRpYWxpemUoKTtcbiAgICAgICAgICAgICAgICBtZS5ub3RpZnlBcHBsaWNhdGlvblJlYWR5KCk7XG4gICAgICAgICAgICAgICAgbWUuaXNTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGVzIHRoZSBtYWluIHZpZXcgb2YgdGhpcyBhcHBsaWNhdGlvblxuICAgICAgICAgKiAqL1xuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTWFpblZpZXcoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKG1lLmNvbmZpZy5tYWluVmlldykge1xuICAgICAgICAgICAgICAgIG1lLm1haW5WaWV3ID0gQmxlbmQuY3JlYXRlQ29tcG9uZW50PEJsZW5kLm1hdGVyaWFsLk1hdGVyaWFsPihtZS5jb25maWcubWFpblZpZXcsIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChCbGVuZC5pc0luc3RhbmNlT2YobWUubWFpblZpZXcsIEJsZW5kLm1hdGVyaWFsLk1hdGVyaWFsKSkge1xuICAgICAgICAgICAgICAgICAgICBtZS5zZXRDb250ZXh0KG1lLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICBtZS5tYWluVmlldy5hZGRDc3NDbGFzcyhcIm1iLW1haW52aWV3XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWUubWFpblZpZXcuZ2V0UHJvcGVydHkoXCJ1c2VQYXJlbnRDb250cm9sbGVyXCIsIHRydWUpID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5tYWluVmlldy5hZGRDb250cm9sbGVyKG1lLmNvbnRyb2xsZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBwcm92aWRlIG1haW5WaWV3IGlzIG5vdCBhIHZhbGlkIFZpZXcgaW5zdGFuY2UhXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBvciBpbnZhbGlkIG1haW5WaWV3IVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCByZW5kZXJNYWluVmlldygpOiBCbGVuZC5kb20uRWxlbWVudCB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYWluVmlldy5nZXRFbGVtZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZmluYWxpemVSZW5kZXIoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgc3VwZXIuZmluYWxpemVSZW5kZXIoKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2UgY2xlYW51cCB0aGUgbWFpbiB2aWV3IGJvdW5kcyB0byBmb3JjZSBpdCB0byBmaXQgaW50byB0aGUgYXBwbGljYXRpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWUubWFpblZpZXcuc2V0Qm91bmRzKHsgdG9wOiBudWxsLCBsZWZ0OiBudWxsLCB3aWR0aDogbnVsbCwgaGVpZ2h0OiBudWxsIH0pO1xuICAgICAgICAgICAgbWUubWFpblZpZXcuc2V0U3R5bGUoeyBkaXNwbGF5OiBudWxsIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHJlbmRlcigpOiBCbGVuZC5kb20uRWxlbWVudCB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIEJsZW5kLmRvbS5FbGVtZW50LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgY2xzOiBbXCJtYi1hcHBsaWNhdGlvblwiXSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW21lLnJlbmRlck1haW5WaWV3KCldXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbnRyeSBwb2ludCBvZiBhIEJsZW5kIGFwcGxpY2F0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBydW4oKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFtZS5pc1N0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICBCbGVuZC5SdW50aW1lLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBtZS5hc3luY1J1bi5hcHBseShtZSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9LCBtZSk7XG4gICAgICAgICAgICAgICAgQmxlbmQuUnVudGltZS5raWNrU3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgVHJ1ZVNvZnR3YXJlIEIuVi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogVGhpcyBjbGFzcyBpcyBhbiBhZGFwdGFpb24gYW5kIHBvcnRlZCBmcm9tIFwiTWF0ZXJpYWwgRGVzaWduIExpdGVcIlxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9UeXBpbmdzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9CbGVuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vQ29tcG9uZW50LnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kb20vRWxlbWVudC50c1wiIC8+XG5cbmludGVyZmFjZSBSaXBwbGVJbnRlcmZhY2UgZXh0ZW5kcyBEaWN0aW9uYXJ5SW50ZXJmYWNlIHtcbiAgICBlbGVtZW50PzogQmxlbmQuZG9tLkVsZW1lbnQ7XG4gICAgY2VudGVyPzogYm9vbGVhbjtcbiAgICBjb2xvcj86IHN0cmluZyB8IEJsZW5kLmRvbS5FbGVtZW50O1xufVxuXG5uYW1lc3BhY2UgQmxlbmQubWF0ZXJpYWwuZWZmZWN0IHtcblxuICAgIGV4cG9ydCBjbGFzcyBSaXBwbGUgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgICAgIHByaXZhdGUgZWxlbWVudDogQmxlbmQuZG9tLkVsZW1lbnQ7XG4gICAgICAgIHByaXZhdGUgY29udGFpbmVyOiBCbGVuZC5kb20uRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBjdXJyZW50UmlwcGxlOiBCbGVuZC5kb20uRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBza2lwTW91c2VFdmVudDogYm9vbGVhbjtcbiAgICAgICAgcHJpdmF0ZSBjZW50ZXI6IGJvb2xlYW47XG4gICAgICAgIHByaXZhdGUgcmlwcGxlRHVyYXRpb246IG51bWJlcjtcbiAgICAgICAgcHJpdmF0ZSByZW1vdmVRdWV1ZTogQXJyYXk8QmxlbmQuZG9tLkVsZW1lbnQ+O1xuICAgICAgICBwcm90ZWN0ZWQgY29sb3I6IHN0cmluZztcblxuICAgICAgICBwdWJsaWMgY29uc3RydWN0b3IoY29uZmlnOiBSaXBwbGVJbnRlcmZhY2UgPSB7fSkge1xuICAgICAgICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5yZW1vdmVRdWV1ZSA9IFtdO1xuICAgICAgICAgICAgbWUucmlwcGxlRHVyYXRpb24gPSAzNTA7XG4gICAgICAgICAgICBtZS5za2lwTW91c2VFdmVudCA9IGZhbHNlO1xuICAgICAgICAgICAgbWUuY2VudGVyID0gY29uZmlnLmNlbnRlciA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIG1lLmVsZW1lbnQgPSBjb25maWcuZWxlbWVudCB8fCBudWxsO1xuICAgICAgICAgICAgaWYgKG1lLmVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBtZS5iaW5kRXZlbnRzKCk7XG4gICAgICAgICAgICAgICAgbWUuc2V0UmlwcGxlQ29sb3IoY29uZmlnLmNvbG9yIHx8IG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGJpbmRFdmVudHMoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKG1lLmVsZW1lbnQuZ2V0UHJvcGVydHkoXCJoYXNSaXBwbGVcIiwgZmFsc2UpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIG1lLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBCbGVuZC5iaW5kKG1lLCBtZS5oYW5kbGVEb3duRXZlbnQpKTtcbiAgICAgICAgICAgICAgICBtZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwIG1vdXNlbGVhdmVcIiwgQmxlbmQuYmluZChtZSwgbWUuaGFuZGxlSGFuZGxlVXBFdmVudCkpO1xuICAgICAgICAgICAgICAgIG1lLmVsZW1lbnQuc2V0UHJvcGVydHkoXCJoYXNSaXBwbGVcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgbWUuY3JlYXRlUmlwcGxlQ29udGFpbmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlUmlwcGxlQ29udGFpbmVyKCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgICAgICBjb3B5U3R5bGVzID0gbWUuZWxlbWVudC5nZXRTdHlsZShbXCJib3JkZXItcmFkaXVzXCIsIFwiYm9yZGVyLWNvbG9yXCIsIFwiYm9yZGVyLXdpZHRoXCIsIFwiYm9yZGVyLXN0eWxlXCJdKTtcbiAgICAgICAgICAgIG1lLmNvbnRhaW5lciA9IG1lLmVsZW1lbnQuYXBwZW5kKEJsZW5kLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIGNsczogXCJtYi1yaXBwbGUtY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgc3R5bGU6IGNvcHlTdHlsZXNcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBoYW5kbGVEb3duRXZlbnQoZXZ0OiBFdmVudCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcywgdG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlciwgbW91c2VFdmVudDogTW91c2VFdmVudDtcbiAgICAgICAgICAgIGlmIChtZS5jZW50ZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbWUuY29udGFpbmVyLmdldEVsKCkuY2xpZW50V2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIHRvcCA9IG1lLmNvbnRhaW5lci5nZXRFbCgpLmNsaWVudEhlaWdodCAvIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vdXNlRXZlbnQgPSA8TW91c2VFdmVudD5ldnQ7XG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlRXZlbnQuc3JjRWxlbWVudCAhPT0gbWUuY29udGFpbmVyLmdldEVsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNyZWN0ID0gbWUuY29udGFpbmVyLmdldEVsKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBtb3VzZUV2ZW50LmNsaWVudFggLSBjcmVjdC5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICB0b3AgPSBtb3VzZUV2ZW50LmNsaWVudFkgLSBjcmVjdC50b3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdCA9ICg8TW91c2VFdmVudD5ldnQpLm9mZnNldFg7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA9ICg8TW91c2VFdmVudD5ldnQpLm9mZnNldFk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWUuaW5pdGlhdGVSaXBwbGUobGVmdCwgdG9wKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBoYW5kbGVIYW5kbGVVcEV2ZW50KCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHdoaWxlIChtZS5yZW1vdmVRdWV1ZS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcmlwcGxlID0gbWUucmVtb3ZlUXVldWUuc3BsaWNlKDAsIDEpWzBdO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJpcHBsZS5yZW1vdmVDc3NDbGFzcyhbXCJtYi1yaXBwbGUtYWN0aXZlXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpcHBsZS5nZXRFbCgpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocmlwcGxlLmdldEVsKCkpO1xuICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICAgICAgICB9LCBtZS5yaXBwbGVEdXJhdGlvbiAqIDAuNCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgaW5pdGlhdGVSaXBwbGUobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgICAgICByaXBwbGUgPSBtZS5jb250YWluZXIuYXBwZW5kKEJsZW5kLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgICAgICAgICBjbHM6IFtcIm1iLXJpcHBsZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogbGVmdFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgICAgIHdpZHRoID0gbWUuZWxlbWVudC5nZXRFbCgpLmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9IG1lLmVsZW1lbnQuZ2V0RWwoKS5jbGllbnRIZWlnaHQsXG4gICAgICAgICAgICAgICAgeCA9IE1hdGgubWF4KE1hdGguYWJzKHdpZHRoIC0gbGVmdCksIGxlZnQpICogMixcbiAgICAgICAgICAgICAgICB5ID0gTWF0aC5tYXgoTWF0aC5hYnMoaGVpZ2h0IC0gdG9wKSwgdG9wKSAqIDIsXG4gICAgICAgICAgICAgICAgc2l6ZSA9IE1hdGguc3FydChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpKTtcbiAgICAgICAgICAgIHJpcHBsZS5zZXRTdHlsZSh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHNpemUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBzaXplLFxuICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBtZS5jb2xvcixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmlwcGxlLmFkZENzc0NsYXNzKFtcIm1iLXJpcHBsZS1wbGFjZWRcIl0pO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByaXBwbGUuYWRkQ3NzQ2xhc3MoW1wibWItcmlwcGxlLXNjYWxlZFwiXSk7XG4gICAgICAgICAgICAgICAgcmlwcGxlLmFkZENzc0NsYXNzKFtcIm1iLXJpcHBsZS1hY3RpdmVcIl0pO1xuICAgICAgICAgICAgfSwgNSk7XG4gICAgICAgICAgICBtZS5yZW1vdmVRdWV1ZS5wdXNoKHJpcHBsZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29udmVydHMgYSBoZXggY29sb3IgdG8gYSBSR0IgZm9ybWF0XG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGhleFRvUmdiKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICAgICAgaWYgKEJsZW5kLmlzU3RyaW5nKHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggIT09IDAgJiYgdmFsdWVbMF0gPT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IHZhbHVlLnNwbGl0KFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiI1wiICsgdFsxXSArIHRbMV0gKyB0WzJdICsgdFsyXSArIHRbM10gKyB0WzNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAgPyBgcmdiYSgke3BhcnNlSW50KHBbMV0sIDE2KX0sJHtwYXJzZUludChwWzJdLCAxNil9LCR7cGFyc2VJbnQocFszXSwgMTYpfSlgIDogbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgc2V0UmlwcGxlQ29sb3IoY29sb3I6IHN0cmluZyB8IEJsZW5kLmRvbS5FbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IG51bWJlciA9IDAuOTUsXG4gICAgICAgICAgICAgICAgcHJvcCA9IFwiY29sb3JcIixcbiAgICAgICAgICAgICAgICBjbHI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBkZWZhdWx0Q29sb3IgPSBcInJnYigwLDAsMClcIjtcblxuICAgICAgICAgICAgaWYgKEJsZW5kLmlzSW5zdGFuY2VPZihjb2xvciwgQmxlbmQuZG9tLkVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgY2xyID0gPHN0cmluZz4oPEJsZW5kLmRvbS5FbGVtZW50PmNvbG9yKS5nZXRTdHlsZShwcm9wKVtwcm9wXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xyID0gPHN0cmluZz5jb2xvcjtcbiAgICAgICAgICAgICAgICBpZiAoY2xyICYmIGNsci5sZW5ndGggIT09IDAgJiYgY2xyWzBdLmluQXJyYXkoW1wiLlwiLCBcIiNcIl0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IEJsZW5kLnNlbGVjdEVsZW1lbnQoY2xyLCBtZS5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbHIgPSA8c3RyaW5nPmVsLmdldFN0eWxlKHByb3ApW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNsciA9IG1lLmhleFRvUmdiKGNsciB8fCBkZWZhdWx0Q29sb3IpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdCA9IGNsci5yZXBsYWNlKC9cXGJyZ2JhXFxifFxcYnJnYlxcYnxcXHN8XFwofFxcKS9nLCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBpZiAodC5sZW5ndGggPj0gMykge1xuICAgICAgICAgICAgICAgIGNsciA9IGByZ2JhKCR7dFswXX0sJHt0WzFdfSwke3RbMl19LCR7b3BhY2l0eX0pYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xyID0gYHJnYmEoMCwwLDAsJHtvcGFjaXR5fSlgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWUuY29sb3IgPSBjbHI7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgVHJ1ZVNvZnR3YXJlIEIuVi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9UeXBpbmdzLnRzXCIgLz5cblxubmFtZXNwYWNlIEJsZW5kLmRvbSB7XG5cbiAgICBleHBvcnQgY2xhc3MgRWxlbWVudENvbmZpZ0J1aWxkZXIge1xuXG4gICAgICAgIHByb3RlY3RlZCBjb25maWc6IENyZWF0ZUVsZW1lbnRJbnRlcmZhY2U7XG5cbiAgICAgICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbmZpZzogc3RyaW5nIHwgQ3JlYXRlRWxlbWVudEludGVyZmFjZSkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcywgY2ZnOiBDcmVhdGVFbGVtZW50SW50ZXJmYWNlID0ge307XG4gICAgICAgICAgICBpZiAoQmxlbmQuaXNTdHJpbmcoY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGFnOiA8c3RyaW5nPmNvbmZpZ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNmZyA9IDxDcmVhdGVFbGVtZW50SW50ZXJmYWNlPmNvbmZpZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lLmNvbmZpZyA9IEJsZW5kLmFwcGx5KFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnOiBcImRpdlwiLFxuICAgICAgICAgICAgICAgICAgICBjbHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyczoge30sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHt9LFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge30sXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGFibGU6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNmZyxcbiAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENoaWxkKGNoaWxkOiBzdHJpbmcgfCBCbGVuZC5kb20uRWxlbWVudENvbmZpZ0J1aWxkZXIgfCBDcmVhdGVFbGVtZW50SW50ZXJmYWNlKTogQmxlbmQuZG9tLkVsZW1lbnRDb25maWdCdWlsZGVyIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoQmxlbmQuaXNJbnN0YW5jZU9mKGNoaWxkLCBCbGVuZC5kb20uRWxlbWVudENvbmZpZ0J1aWxkZXIpKSB7XG4gICAgICAgICAgICAgICAgbWUuY29uZmlnLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIHJldHVybiA8QmxlbmQuZG9tLkVsZW1lbnRDb25maWdCdWlsZGVyPmNoaWxkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IG5ldyBCbGVuZC5kb20uRWxlbWVudENvbmZpZ0J1aWxkZXIoPENyZWF0ZUVsZW1lbnRJbnRlcmZhY2U+Y2hpbGQpO1xuICAgICAgICAgICAgICAgIG1lLmNvbmZpZy5jaGlsZHJlbi5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldFN0eWxlKHN0eWxlczogU3R5bGVJbnRlcmZhY2UpOiBCbGVuZC5kb20uRWxlbWVudENvbmZpZ0J1aWxkZXIge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIEJsZW5kLmZvckVhY2goc3R5bGVzLCBmdW5jdGlvbih2OiBhbnksIGs6IHN0cmluZykge1xuICAgICAgICAgICAgICAgIG1lLmNvbmZpZy5zdHlsZVtrXSA9IHY7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldFNlbGVjdGFibGUoc3RhdGU6IGJvb2xlYW4pOiBCbGVuZC5kb20uRWxlbWVudENvbmZpZ0J1aWxkZXIge1xuICAgICAgICAgICAgdGhpcy5jb25maWcuc2VsZWN0YWJsZSA9IHN0YXRlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBzZXRUZXh0KHRleHQ6IHN0cmluZyk6IEJsZW5kLmRvbS5FbGVtZW50Q29uZmlnQnVpbGRlciB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy50ZXh0ID0gdGV4dDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZENTUyhjc3M6IEFycmF5PHN0cmluZz4pOiBCbGVuZC5kb20uRWxlbWVudENvbmZpZ0J1aWxkZXIge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIGNzcy5mb3JFYWNoKGZ1bmN0aW9uKGl0bTogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgKDxBcnJheTxzdHJpbmc+Pm1lLmNvbmZpZy5jbHMpLnB1c2goaXRtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0T0lEKG9pZDogc3RyaW5nKTogQmxlbmQuZG9tLkVsZW1lbnRDb25maWdCdWlsZGVyIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLm9pZCA9IG9pZDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldFRhZyh0YWc6IHN0cmluZyk6IEJsZW5kLmRvbS5FbGVtZW50Q29uZmlnQnVpbGRlciB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy50YWcgPSB0YWc7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb25maWcoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL21hdGVyaWFsL01hdGVyaWFsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9tYXRlcmlhbC9lZmZlY3QvUmlwcGxlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9kb20vRWxlbWVudC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZG9tL0VsZW1lbnRDb25maWdCdWlsZGVyLnRzXCIgLz5cblxubmFtZXNwYWNlIEJsZW5kLmJ1dHRvbiB7XG5cbiAgICAvKipcbiAgICAgKiBCYXNlIGNsYXNzIGZvciBpbXBsZW1lbnRpbmcgYSBCdXR0b25cbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgQmxlbmQubWF0ZXJpYWwuTWF0ZXJpYWwge1xuXG4gICAgICAgIHByb3RlY3RlZCBjb25maWc6IEJ1dHRvbkludGVyZmFjZTtcbiAgICAgICAgcHJvdGVjdGVkIHdyYXBwZXJFbGVtZW50OiBCbGVuZC5kb20uRWxlbWVudCA9IG51bGw7XG4gICAgICAgIHByb3RlY3RlZCB0ZXh0RWxlbWVudDogQmxlbmQuZG9tLkVsZW1lbnQgPSBudWxsO1xuICAgICAgICBwcm90ZWN0ZWQgaWNvbkVsZW1lbnQ6IEJsZW5kLmRvbS5FbGVtZW50ID0gbnVsbDtcbiAgICAgICAgcHJvdGVjdGVkIGJ1dHRvblR5cGVzOiBBcnJheTxzdHJpbmc+O1xuICAgICAgICBwcm90ZWN0ZWQgZmFiUG9zaXRpb25zOiBBcnJheTxzdHJpbmc+O1xuICAgICAgICBwcm90ZWN0ZWQgaWNvblNpemVzOiBEaWN0aW9uYXJ5SW50ZXJmYWNlO1xuICAgICAgICBwcm90ZWN0ZWQgcmlwcGxlRWZmZWN0OiBCbGVuZC5tYXRlcmlhbC5lZmZlY3QuUmlwcGxlO1xuXG4gICAgICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IEJ1dHRvbkludGVyZmFjZSA9IHt9KSB7XG4gICAgICAgICAgICBzdXBlcihjb25maWcpO1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmJ1dHRvblR5cGVzID0gW1wiZmxhdFwiLCBcInJhaXNlZFwiLCBcImZhYlwiLCBcImZhYi1taW5pXCIsIFwicm91bmQtZmxhdFwiLCBcInJvdW5kLXJhaXNlZFwiXTtcbiAgICAgICAgICAgIG1lLmZhYlBvc2l0aW9ucyA9IFtcbiAgICAgICAgICAgICAgICBcInRvcC1yaWdodFwiLFxuICAgICAgICAgICAgICAgIFwidG9wLWNlbnRlclwiLFxuICAgICAgICAgICAgICAgIFwidG9wLWxlZnRcIixcbiAgICAgICAgICAgICAgICBcImNlbnRlci1yaWdodFwiLFxuICAgICAgICAgICAgICAgIFwiY2VudGVyLWNlbnRlclwiLFxuICAgICAgICAgICAgICAgIFwiY2VudGVyLWxlZnRcIixcbiAgICAgICAgICAgICAgICBcImJvdHRvbS1yaWdodFwiLFxuICAgICAgICAgICAgICAgIFwiYm90dG9tLWNlbnRlclwiLFxuICAgICAgICAgICAgICAgIFwiYm90dG9tLWxlZnRcIixcbiAgICAgICAgICAgICAgICBcInJlbGF0aXZlXCJcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIG1lLmljb25TaXplcyA9IHtcbiAgICAgICAgICAgICAgICBcInNtYWxsXCI6IDE4LFxuICAgICAgICAgICAgICAgIFwibWVkaXVtXCI6IDI0LFxuICAgICAgICAgICAgICAgIFwibGFyZ2VcIjogMzYsXG4gICAgICAgICAgICAgICAgXCJ4bGFyZ2VcIjogNDhcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG1lLmNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBjb25maWcudGV4dCB8fCBcIlwiLFxuICAgICAgICAgICAgICAgIGljb246IGNvbmZpZy5pY29uIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgaWNvbkZhbWlseTogY29uZmlnLmljb25GYW1pbHkgfHwgXCJtYXRlcmlhbC1pY29uc1wiLFxuICAgICAgICAgICAgICAgIGljb25BbGlnbjogbWUuZ2V0Q2hlY2tJY29uQWxpZ24oY29uZmlnLmljb25BbGlnbiksXG4gICAgICAgICAgICAgICAgYnV0dG9uVHlwZTogbWUuZ2V0Q2hlY2tCdXR0b25UeXBlKGNvbmZpZy5idXR0b25UeXBlKSxcbiAgICAgICAgICAgICAgICBmYWJQb3NpdGlvbjogbWUuZ2V0Q2hlY2tGYWJQb3NpdGlvbihjb25maWcuZmFiUG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIHRoZW1lOiBjb25maWcudGhlbWUgfHwgXCJkZWZhdWx0XCIsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IGNvbmZpZy5kaXNhYmxlZCA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpY29uU2l6ZTogY29uZmlnLmljb25TaXplIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgcmlwcGxlOiBjb25maWcucmlwcGxlID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRTdGF0ZSh2YWx1ZTogYm9vbGVhbik6IEJsZW5kLmJ1dHRvbi5CdXR0b24ge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmNvbmZpZy5kaXNhYmxlZCA9ICF2YWx1ZTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIG1lLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLmNvbmZpZy5kaXNhYmxlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0Q2hlY2xJY29uU2l6ZShpY29uU2l6ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBpY29uU2l6ZSA9IGljb25TaXplIHx8IFwiZGVmYXVsdFwiO1xuICAgICAgICAgICAgaWNvblNpemUgPSBpY29uU2l6ZS5pbkFycmF5KE9iamVjdC5rZXlzKG1lLmljb25TaXplcykpID8gaWNvblNpemUgOiBcImRlZmF1bHRcIjtcbiAgICAgICAgICAgIHJldHVybiBpY29uU2l6ZSA9PT0gXCJkZWZhdWx0XCIgPyBudWxsIDogaWNvblNpemU7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGdldENoZWNrRmFiUG9zaXRpb24oZmFiUG9zaXRpb246IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgZmFiUG9zaXRpb24gPSBmYWJQb3NpdGlvbiB8fCBcInJlbGF0aXZlXCI7XG4gICAgICAgICAgICBmYWJQb3NpdGlvbiA9IGZhYlBvc2l0aW9uLmluQXJyYXkobWUuZmFiUG9zaXRpb25zKSA/IGZhYlBvc2l0aW9uIDogXCJyZWxhdGl2ZVwiO1xuICAgICAgICAgICAgcmV0dXJuIGZhYlBvc2l0aW9uID09PSBcInJlbGF0aXZlXCIgPyBudWxsIDogZmFiUG9zaXRpb247XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGdldENoZWNrSWNvbkFsaWduKGljb25BbGlnbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGljb25BbGlnbiA9IGljb25BbGlnbiB8fCBcImxlZnRcIjtcbiAgICAgICAgICAgIHJldHVybiBpY29uQWxpZ24uaW5BcnJheShbXCJsZWZ0XCIsIFwicmlnaHRcIl0pID8gaWNvbkFsaWduIDogXCJsZWZ0XCI7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGdldENoZWNrQnV0dG9uVHlwZShidXR0b25UeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIGJ1dHRvblR5cGUgPSAoYnV0dG9uVHlwZSB8fCBcImZsYXRcIik7XG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uVHlwZS5pbkFycmF5KG1lLmJ1dHRvblR5cGVzKSA/IGJ1dHRvblR5cGUgOiBcImZsYXRcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRUaGVtZSh0aGVtZTogc3RyaW5nKTogQmxlbmQuYnV0dG9uLkJ1dHRvbiB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgbWUuY29uZmlnLnRoZW1lID0gdGhlbWUgfHwgXCJkZWZhdWx0XCI7XG4gICAgICAgICAgICBtZS5wZXJmb3JtTGF5b3V0KCk7XG4gICAgICAgICAgICByZXR1cm4gbWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0QnV0dG9uVHlwZShidXR0b25UeXBlOiBzdHJpbmcpOiBCbGVuZC5idXR0b24uQnV0dG9uIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5jb25maWcuYnV0dG9uVHlwZSA9IG1lLmdldENoZWNrQnV0dG9uVHlwZShidXR0b25UeXBlKTtcbiAgICAgICAgICAgIG1lLmVsZW1lbnQuY2xlYXJDc3NDbGFzcygpLmFkZENzc0NsYXNzKFtcIm1iLWJ0blwiXSk7XG4gICAgICAgICAgICBtZS5wZXJmb3JtTGF5b3V0KCk7XG4gICAgICAgICAgICByZXR1cm4gbWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0VGV4dCh0ZXh0OiBzdHJpbmcpOiBCbGVuZC5idXR0b24uQnV0dG9uIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5jb25maWcudGV4dCA9IHRleHQ7XG4gICAgICAgICAgICBtZS50ZXh0RWxlbWVudC5zZXRIdG1sKHRleHQpO1xuICAgICAgICAgICAgbWUucGVyZm9ybUxheW91dCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0SWNvblNpemUoaWNvblNpemU6IHN0cmluZyk6IEJsZW5kLmJ1dHRvbi5CdXR0b24ge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgICAgICBzaXplQ3NzID0gXCJtYi1idG4taWNvbi1zaXplXCI7XG4gICAgICAgICAgICBtZS5jb25maWcuaWNvblNpemUgPSBtZS5nZXRDaGVjbEljb25TaXplKGljb25TaXplKTtcbiAgICAgICAgICAgIG1lLmVsZW1lbnQucmVtb3ZlQ3NzQ2xhc3NMaWtlKFtzaXplQ3NzXSk7XG4gICAgICAgICAgICBpZiAoaWNvblNpemUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBtZS5lbGVtZW50LmFkZENzc0NsYXNzKFtgJHtzaXplQ3NzfS1gICsgbWUuY29uZmlnLmljb25TaXplXSk7XG4gICAgICAgICAgICAgICAgbWUucGVyZm9ybUxheW91dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRJY29uKGljb246IHN0cmluZyk6IEJsZW5kLmJ1dHRvbi5CdXR0b24ge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmNvbmZpZy5pY29uID0gaWNvbjtcbiAgICAgICAgICAgIG1lLmljb25FbGVtZW50LnNldEh0bWwoaWNvbik7XG4gICAgICAgICAgICBtZS5wZXJmb3JtTGF5b3V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRGYWJQb3NpdGlvbihmYWJQb3NpdGlvbjogc3RyaW5nKTogQmxlbmQuYnV0dG9uLkJ1dHRvbiB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHBvc0NzcyA9IGBtYi0ke21lLmNvbmZpZy5idXR0b25UeXBlfS1wb3NgO1xuICAgICAgICAgICAgaWYgKG1lLmlzRmFiKCkpIHtcbiAgICAgICAgICAgICAgICBtZS5jb25maWcuZmFiUG9zaXRpb24gPSBtZS5nZXRDaGVja0ZhYlBvc2l0aW9uKGZhYlBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBtZS5lbGVtZW50LnJlbW92ZUNzc0NsYXNzTGlrZShbcG9zQ3NzXSk7XG4gICAgICAgICAgICAgICAgbWUuZWxlbWVudC5hZGRDc3NDbGFzcyhbYCR7cG9zQ3NzfS1gICsgbWUuY29uZmlnLmZhYlBvc2l0aW9uXSk7XG4gICAgICAgICAgICAgICAgbWUucGVyZm9ybUxheW91dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlTGF5b3V0KCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgICAgICB0aGVtZUNsczogc3RyaW5nID0gYGJ0bi10aGVtZS0ke21lLmNvbmZpZy5idXR0b25UeXBlfS0ke21lLmNvbmZpZy50aGVtZX1gLFxuICAgICAgICAgICAgICAgIGJvdGhDbHM6IHN0cmluZyA9IGBtYi1idG4tJHttZS5jb25maWcuYnV0dG9uVHlwZX0tYm90aGAsXG4gICAgICAgICAgICAgICAgdGV4dE9ubHlDbHM6IHN0cmluZyA9IGBtYi1idG4tJHttZS5jb25maWcuYnV0dG9uVHlwZX0tdGV4dC1vbmx5YCxcbiAgICAgICAgICAgICAgICBpY29uT25seUNsczogc3RyaW5nID0gYG1iLWJ0bi0ke21lLmNvbmZpZy5idXR0b25UeXBlfS1pY29uLW9ubHlgLFxuICAgICAgICAgICAgICAgIHRleHRJY29uQ2xzOiBzdHJpbmcgPSBcIm1iLWJ0bi1pbm5lci10ZXh0aWNvblwiLFxuICAgICAgICAgICAgICAgIGljb25UZXh0Q2xzOiBzdHJpbmcgPSBcIm1iLWJ0bi1pbm5lci1pY29udGV4dFwiLFxuICAgICAgICAgICAgICAgIGhhc0ljb246IGJvb2xlYW4gPSBtZS5jb25maWcuaWNvbiAhPT0gbnVsbCxcbiAgICAgICAgICAgICAgICBoYXNUZXh0OiBib29sZWFuID0gKG1lLmNvbmZpZy50ZXh0IHx8IFwiXCIpLnRyaW0oKSAhPT0gXCJcIixcbiAgICAgICAgICAgICAgICByb3VuZE9yRmFiQnV0dG9uOiBib29sZWFuID0gbWUuY29uZmlnLmJ1dHRvblR5cGUuaW5kZXhPZihcInJvdW5kXCIpICE9PSAtMSB8fCBtZS5jb25maWcuYnV0dG9uVHlwZS5pbmRleE9mKFwiZmFiXCIpICE9PSAtMTtcblxuICAgICAgICAgICAgbWUuZWxlbWVudC5yZW1vdmVDc3NDbGFzcyhbdGV4dE9ubHlDbHMsIGljb25Pbmx5Q2xzLCBib3RoQ2xzLCB0aGVtZUNsc10pO1xuICAgICAgICAgICAgbWUud3JhcHBlckVsZW1lbnQucmVtb3ZlQ3NzQ2xhc3MoW3RleHRJY29uQ2xzLCBpY29uVGV4dENsc10pO1xuXG4gICAgICAgICAgICBpZiAobWUuaXNGYWIoKSB8fCBtZS5pc1JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICBoYXNUZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNJY29uKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0ljb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBtZS5zZXRJY29uKFwibW9vZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1lLmNvbmZpZy5mYWJQb3NpdGlvbiAmJiBtZS5pc0ZhYigpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lLnNldEZhYlBvc2l0aW9uKG1lLmNvbmZpZy5mYWJQb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtZS5pc1JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWUuc2V0SWNvblNpemUobWUuY29uZmlnLmljb25TaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lLnNldEljb25TaXplKG1lLmNvbmZpZy5pY29uU2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoYXNUZXh0ICYmIGhhc0ljb24pIHtcbiAgICAgICAgICAgICAgICBtZS5lbGVtZW50LmFkZENzc0NsYXNzKFtib3RoQ2xzXSk7XG4gICAgICAgICAgICAgICAgaWYgKG1lLmNvbmZpZy5pY29uQWxpZ24gPT09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lLndyYXBwZXJFbGVtZW50LmFkZENzc0NsYXNzKGljb25UZXh0Q2xzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1lLmNvbmZpZy5pY29uQWxpZ24gPT09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgICAgICAgICBtZS53cmFwcGVyRWxlbWVudC5hZGRDc3NDbGFzcyh0ZXh0SWNvbkNscyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNUZXh0KSB7XG4gICAgICAgICAgICAgICAgbWUuZWxlbWVudC5hZGRDc3NDbGFzcyhbdGV4dE9ubHlDbHNdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzSWNvbikge1xuICAgICAgICAgICAgICAgIG1lLmVsZW1lbnQuYWRkQ3NzQ2xhc3MoW2ljb25Pbmx5Q2xzXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1lLmVsZW1lbnQuYWRkQ3NzQ2xhc3MoW3RoZW1lQ2xzXSk7XG4gICAgICAgICAgICBtZS5zZXRTdGF0ZSghbWUuY29uZmlnLmRpc2FibGVkKTtcblxuICAgICAgICAgICAgaWYgKG1lLmNvbmZpZy5yaXBwbGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBtZS5yaXBwbGVFZmZlY3QgPSBudWxsOyAvLyByZW1vdmUgdGhlIG9sZCBvbmUhXG4gICAgICAgICAgICAgICAgbWUucmlwcGxlRWZmZWN0ID0gbmV3IEJsZW5kLm1hdGVyaWFsLmVmZmVjdC5SaXBwbGUoPFJpcHBsZUludGVyZmFjZT57XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IG1lLmVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcjogcm91bmRPckZhYkJ1dHRvbiA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHJvdW5kT3JGYWJCdXR0b24gPyBtZS5pY29uRWxlbWVudCA6IG1lLnRleHRFbGVtZW50XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgbm90aWZ5Q2xpY2soZXZ0OiBFdmVudCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmZpcmVFdmVudChcImNsaWNrXCIsIGV2dCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgaW5pdEV2ZW50cygpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZS5ub3RpZnlDbGljay5iaW5kKG1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2sgaWYgdGhpcyBidXR0b24gaXMgYSBGbG9hdGluZyBBY3Rpb24gQnV0dG9uXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgaXNGYWIoKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuYnV0dG9uVHlwZS5pbmRleE9mKFwiZmFiXCIpICE9PSAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVjayBpZiB0aGlzIGJ1dHRvbiBpcyBlaXRoZXIgYSByb3VuZC1mbGF0IG9yIHJvdW5kLXJhaXNlZFxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIGlzUm91bmQoKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuYnV0dG9uVHlwZS5pbmRleE9mKFwicm91bmRcIikgIT09IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHJlbmRlcigpOiBCbGVuZC5kb20uRWxlbWVudCB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uRWwgPSBuZXcgQmxlbmQuZG9tLkVsZW1lbnRDb25maWdCdWlsZGVyKFwiYnV0dG9uXCIpXG4gICAgICAgICAgICAgICAgLmFkZENTUyhbXCJtYi1idG5cIl0pO1xuXG4gICAgICAgICAgICB2YXIgaW5uZXJFbCA9IG5ldyBCbGVuZC5kb20uRWxlbWVudENvbmZpZ0J1aWxkZXIoXCJzcGFuXCIpXG4gICAgICAgICAgICAgICAgLnNldE9JRChcIndyYXBwZXJFbGVtZW50XCIpXG4gICAgICAgICAgICAgICAgLmFkZENTUyhbXCJtYi1idG4taW5uZXJcIl0pO1xuXG4gICAgICAgICAgICB2YXIgdHh0RWwgPSBuZXcgQmxlbmQuZG9tLkVsZW1lbnRDb25maWdCdWlsZGVyKFwic3BhblwiKVxuICAgICAgICAgICAgICAgIC5zZXRPSUQoXCJ0ZXh0RWxlbWVudFwiKVxuICAgICAgICAgICAgICAgIC5hZGRDU1MoW1wibWItYnRuLXRleHRcIl0pXG4gICAgICAgICAgICAgICAgLnNldFRleHQobWUuY29uZmlnLnRleHQpO1xuXG4gICAgICAgICAgICB2YXIgaWNvbkVsID0gbmV3IEJsZW5kLmRvbS5FbGVtZW50Q29uZmlnQnVpbGRlcihcImlcIilcbiAgICAgICAgICAgICAgICAuc2V0T0lEKFwiaWNvbkVsZW1lbnRcIilcbiAgICAgICAgICAgICAgICAuYWRkQ1NTKFtcIm1iLWJ0bi1pY29uXCIsIG1lLmNvbmZpZy5pY29uRmFtaWx5XSk7XG5cbiAgICAgICAgICAgIGlmIChtZS5jb25maWcuaWNvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGljb25FbC5zZXRUZXh0KG1lLmNvbmZpZy5pY29uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtZS5jb25maWcuaWNvbkFsaWduID09PSBcImxlZnRcIikge1xuICAgICAgICAgICAgICAgIGlubmVyRWwuYWRkQ2hpbGQoaWNvbkVsKTtcbiAgICAgICAgICAgICAgICBpbm5lckVsLmFkZENoaWxkKHR4dEVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1lLmNvbmZpZy5pY29uQWxpZ24gPT09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgICAgIGlubmVyRWwuYWRkQ2hpbGQodHh0RWwpO1xuICAgICAgICAgICAgICAgIGlubmVyRWwuYWRkQ2hpbGQoaWNvbkVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnV0dG9uRWwuYWRkQ2hpbGQoaW5uZXJFbCk7XG5cbiAgICAgICAgICAgIHJldHVybiBCbGVuZC5kb20uRWxlbWVudC5jcmVhdGUoYnV0dG9uRWwsIG1lLmFzc2lnbkVsZW1lbnRCeU9JRCwgbWUpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IFRydWVTb2Z0d2FyZSBCLlYuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbWF0ZXJpYWwvTWF0ZXJpYWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2RvbS9FbGVtZW50LnRzXCIgLz5cblxubmFtZXNwYWNlIEJsZW5kLmNvbnRhaW5lciB7XG5cbiAgICBleHBvcnQgY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgQmxlbmQubWF0ZXJpYWwuTWF0ZXJpYWwge1xuXG4gICAgfVxufSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgVHJ1ZVNvZnR3YXJlIEIuVi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGludGVyZmFjZVxuICogSW50ZXJmYWNlIGZvciBpbXBsZW1lbnRpbmcgYSBsb2dnZXIgY29tcG9uZW50XG4gKi9cbmludGVyZmFjZSBMb2dnZXJJbnRlcmZhY2Uge1xuXG4gICAgb3BlbigpOiBhbnk7XG5cbiAgICBjbG9zZSgpOiBhbnk7XG5cbiAgICBsb2codHlwZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGNvbnRleHQ/OiBhbnkpOiBhbnk7XG5cbiAgICB3YXJuKG1lc3NhZ2U6IHN0cmluZywgY29udGV4dD86IGFueSk6IGFueTtcblxuICAgIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgY29udGV4dD86IGFueSk6IGFueTtcblxuICAgIGluZm8obWVzc2FnZTogc3RyaW5nLCBjb250ZXh0PzogYW55KTogYW55O1xuXG4gICAgZGVidWcobWVzc2FnZTogc3RyaW5nLCBjb250ZXh0PzogYW55KTogYW55O1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0JsZW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJNYXRlcmlhbC50c1wiIC8+XG5cbmludGVyZmFjZSBSZWN0YW5nbGVJbnRlcmZhY2UgZXh0ZW5kcyBNYXRlcmlhbEludGVyZmFjZSB7XG4gICAgY29sb3I/OiBzdHJpbmc7XG4gICAgYm9yZGVyPzogYm9vbGVhbjtcbn1cblxubmFtZXNwYWNlIEJsZW5kLm1hdGVyaWFsIHtcblxuICAgIGV4cG9ydCBjbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBCbGVuZC5tYXRlcmlhbC5NYXRlcmlhbCB7XG5cbiAgICAgICAgcHJvdGVjdGVkIGNvbmZpZzogUmVjdGFuZ2xlSW50ZXJmYWNlO1xuICAgICAgICBwcml2YXRlIGxheW91dENvdW50OiBudW1iZXI7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29uZmlnOiBSZWN0YW5nbGVJbnRlcmZhY2UgPSB7fSkge1xuICAgICAgICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5zZXRCb3VuZHMoe1xuICAgICAgICAgICAgICAgIHdpZHRoOiBjb25maWcud2lkdGggfHwgMTAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogY29uZmlnLmhlaWdodCB8fCAxMDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWUuc2V0U3R5bGUoe1xuICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBjb25maWcuY29sb3IgfHwgXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgIFwiYm9yZGVyXCI6IGNvbmZpZy5ib3JkZXIgPT09IHRydWUgPyBcIjFweCBzb2xpZCAjMDAwXCIgOiBudWxsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1lLmxheW91dENvdW50ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBsYXlvdXRWaWV3KCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIG1lLmxheW91dENvdW50Kys7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZmluYWxpemVSZW5kZXIoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgc3VwZXIuZmluYWxpemVSZW5kZXIoKTtcbiAgICAgICAgICAgIG1lLmFkZENzc0NsYXNzKFwibS1yZWN0YW5nbGVcIik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGxvZygpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICBtZS5lbGVtZW50LnNldEh0bWwoYDxwcmU+TGF5b3V0czogJHttZS5sYXlvdXRDb3VudH08L3ByZT5gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lzdGVyQ2xhc3NXaXRoQWxpYXMoXCJtYi5yZWN0XCIsIEJsZW5kLm1hdGVyaWFsLlJlY3RhbmdsZSk7XG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1R5cGluZ3MudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0NvbXBvbmVudC50c1wiIC8+XG5cbm5hbWVzcGFjZSBCbGVuZC5tdmMge1xuXG4gICAgLyoqXG4gICAgICogUHJvdmlkZXMgYSBnZW5lcmljIGFuZCBiaW5kYWJsZSBNb2RlbFxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIEJsZW5kLkNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJvdGVjdGVkIGRhdGE6IERpY3Rpb25hcnlJbnRlcmZhY2U7XG5cbiAgICAgICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbmZpZzogRGljdGlvbmFyeUludGVyZmFjZSA9IHt9KSB7XG4gICAgICAgICAgICBzdXBlcihjb25maWcpO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gY29uZmlnO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0aWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiBTZXRzIHRoZSB2YWx1ZXMgb2YgdGhlIGZpZWxkcyBpbiB0aGlzIE1vZGVsLiBUaGlzIGFjdGlvbiB0cmlnZ2Vyc1xuICAgICAgICAqIGFsbCB0aGUgaGFuZGxlcnMgZm9yIGJvdW5kIFZpZXcgc2V0dGVyc1xuICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc2V0RGF0YShkYXRhOiBEaWN0aW9uYXJ5SW50ZXJmYWNlKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHNuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBCbGVuZC5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKHZhbHVlOiBzdHJpbmcsIG5hbWU6IGFueSkge1xuICAgICAgICAgICAgICAgIHNuYW1lID0gXCJzZXRcIiArIG5hbWUudWNmaXJzdCgpO1xuICAgICAgICAgICAgICAgIGlmIChtZS5oYXNGdW5jdGlvbihzbmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWUuYXBwbHlGdW5jdGlvbihzbmFtZSwgW3ZhbHVlXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgY3VycmVudCBkYXRhIGluIHRoaXMgTW9kZWxcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXREYXRhKCk6IERpY3Rpb25hcnlJbnRlcmZhY2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGVzIGF1dG9tYXRpYyBwcm9wZXJ0aWVzIGZvciB0aGlzIE1vZGVsIHdoZW4gdGhlcmUgYXJlIG5vXG4gICAgICAgICAqIGN1c3RvbSBnZXR0ZXJzL3NldHRlcnMgYXZhaWxhYmxlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGNyZWF0ZVByb3BlcnRpZXMoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHNuYW1lOiBzdHJpbmcsIGduYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBCbGVuZC5mb3JFYWNoKG1lLmRhdGEsIGZ1bmN0aW9uKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZykge1xuICAgICAgICAgICAgICAgIGduYW1lID0gXCJnZXRcIiArIG5hbWUudWNmaXJzdCgpLFxuICAgICAgICAgICAgICAgICAgICBzbmFtZSA9IFwic2V0XCIgKyBuYW1lLnVjZmlyc3QoKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1lLmhhc0Z1bmN0aW9uKGduYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAoPGFueT5tZSlbZ25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWUuZGF0YVtuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFtZS5oYXNGdW5jdGlvbihzbmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+bWUpW3NuYW1lXSA9IGZ1bmN0aW9uKGRhdGE6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWUuZGF0YVtuYW1lXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWU7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBUcnVlU29mdHdhcmUgQi5WLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2FwcGxpY2F0aW9uL0FwcGxpY2F0aW9uLnRzXCIgLz5cblxubmFtZXNwYWNlIEJsZW5kLndlYiB7XG4gICAgLyoqXG4gICAgICogQmFzZSBjbGFzcyBmb3IgYSB3ZWIvZGVza3RvcCBhcHBsaWNhdGlvblxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiBleHRlbmRzIEJsZW5kLmFwcGxpY2F0aW9uLkFwcGxpY2F0aW9uIHtcbiAgICB9XG59Il19