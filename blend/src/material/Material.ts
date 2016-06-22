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

namespace Blend.material {

    /**
     * Abstract base class for a Material
     */
    export abstract class Material extends Blend.mvc.View {

        protected parent: Blend.material.Material;
        protected element: Blend.dom.Element;
        protected isRendered: boolean;
        protected visible: boolean;
        protected config: MaterialInterface;
        protected useParentControllers: boolean;
        protected isInitialized: boolean;
        protected canLayout: boolean;

        public constructor(config: MaterialInterface = {}) {
            super(config);
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
                flex: config.flex || null,
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
        protected updateLayout() {
        }

        /**
         * Pre updateLayout hook
         */
        protected preUpdateLayout() {

        }

        /**
         * Post updatelayout hook
         */
        protected postUpdateLayout() {

        }

        /**
         * Initiates a sub-layout process.
         */
        public performLayout() {
            var me = this;
            if (me.canLayout === true) {
                me.suspendLayout();
                me.preUpdateLayout();
                me.updateLayout();
                me.postUpdateLayout();
                me.resumeLayout();
            }
        }

        /**
         * Suspends the sub-layout from staring
         */
        protected suspendLayout() {
            this.canLayout = false;
        }

        /**
         * Resumes the sub-layout
         */
        protected resumeLayout() {
            this.canLayout = true;
        }

        /**
         * This function is used internally on render time to assign element IDs to
         * properties
         */
        protected assignElementByOID(el: Blend.dom.Element, oid: string) {
            var me: any = this;
            if (me[oid] === null) {
                me[oid] = el;
            }
        }

        /**
         * Initialized a responsive listener for this Material by adding a listener to the
         * Runtime.addMediaQueryListener
         */
        protected initializeResponsiveEvents() {
            var me = this, config: MediaQueryConfig;

            config = me.config.responsive === true ? Blend.COMMON_MEDIA_QUERIES
                : me.config.responseTo || null;

            if (config !== null) {
                Blend.forEach(config, function (queries: Array<string>, alias: string) {
                    queries = Blend.wrapInArray<string>(queries);
                    queries.forEach(function (mediaQuery: string) {
                        Blend.Runtime.addMediaQueryListener(mediaQuery, function (mql: MediaQueryList) {
                            me.fireEvent("responsiveChanged", alias, mql);
                        });
                    });
                });
            }
        }

        public getProperty<T>(name: string, defaultValue: any = null): T {
            var me: any = this;
            if (name.indexOf("config.", 0) === 0) {
                name = name.replace("config.", "").trim();
                return (me.config[name] === undefined ? defaultValue : me.config[name]);
            } else {
                return super.getProperty<T>(name, defaultValue);
            }
        }

        protected render(): Blend.dom.Element {
            return Blend.dom.Element.create({});
        }

        /**
         * Sends a materialInitialized notification
         */
        protected notifyMaterialInitialized() {
            var me = this;
            me.fireEvent("materialInitialized", me);
        }

        /**
         * DO NOT USE THIS FUNCTION!
         * Internal function that is called by the parent/host to initiate
         * the initialization process
          */
        public doInitialize(): Blend.material.Material {
            var me = this;
            me.initEvents();
            me.preInitialize();
            me.initialize();
            me.postInitialize();
            me.notifyMaterialInitialized();
            return me;
        }

        /**
         * Pre initilization hook
         */
        protected preInitialize() {

        }

        /**
         * Post initialization hook
         */
        protected postInitialize() {

        }

        /**
         * This function can be overriden to do custom initialization on this Material
         */
        public initialize() {

        }

        /**
         * Override this method for creating event listeners for this Material
         */
        protected initEvents() {

        }

        /**
         * Check if events can be fired on this Material
         */
        public canFireEvents(): boolean {
            var me = this, state: boolean;
            if (super.canFireEvents()) {
                if (me.parent !== null) {
                    state = me.parent.canFireEvents();
                } else {
                    state = true;
                }
            } else {
                state = false;
            }
            if (state === false && me.currentEventName === "materialInitialized") {
                return true;
            } else {
                return state;
            }
        }

        /////////////////////////////////////////////////////////////////////////
        // BOUNDS
        /////////////////////////////////////////////////////////////////////////

        /**
         * Returns the bounds of this Material based on the ElementBoundsInterface interface
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
         * Sets the bounds of this Material based on the ElementBoundsInterface interface
         */
        setBounds(bounds: ElementBoundsInterface): Blend.material.Material {
            var me = this, nullBounds: StyleInterface = { top: null, left: null, width: null, height: null };
            if (me.isRendered) {
                me.setStyle(bounds === null ? nullBounds : <StyleInterface>bounds);
            } else {
                Blend.apply(me.config, bounds === null ? nullBounds : bounds);
            }
            me.notifyBoundsChanged();
            return this;
        }

        /**
         * Sends boundsChanged notification
         */
        notifyBoundsChanged() {
            var me = this;
            if (me.isRendered) {
                me.fireEvent("boundsChanged", me.getBounds());
            }
        }


        /////////////////////////////////////////////////////////////////////////
        // VISIBILITY
        //////////////////////////////////////////////////////////////////////////

        /**
         * Sets the visibility state for this Material
         */
        setVisible(visible: boolean = true): Blend.material.Material {
            var me = this;
            me.visible = visible === true ? true : false;
            if (me.isRendered) {
                me.element.setData("visible", me.visible);
            } else {
                me.config.visible = me.visible;
            }
            me.notifyVisibilityChanged();
            return this;
        }

        /**
         * gets the visibility state of this Material
         */
        public isVisible() {
            var me = this;
            return me.visible;
        }

        /**
         * Sends a visibilityChanged notification
         */
        protected notifyVisibilityChanged() {
            var me = this;
            me.fireEvent("visibilityChanged", me.visible);
        }

        /////////////////////////////////////////////////////////////////////////
        // STYLE and CSS
        //////////////////////////////////////////////////////////////////////////

        /**
         * Sets the Styles for this Material
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
         * Adds one or more CSS classes to this Material
         */
        public addCssClass(css: string | Array<string>) {
            var me = this;
            if (me.isRendered) {
                me.element.addCssClass(css);
            } else {
                Blend.wrapInArray(css).forEach(function (itm: string) {
                    (<Array<string>>me.config.css).push(itm);
                });
            }
            me.notifyStyleOrCSSChanged();
        }

        /**
         * Sends a visibilityChanged notification
         */
        protected notifyStyleOrCSSChanged() {
            var me = this;
            me.fireEvent("styleChanged", me.visible);
        }

        /**
         *Helps configuring the this Material before the rendering cycle is complete
         */
        protected finalizeRender(config: FinalizeRenderConfig = {}) {
            var me = this,
                cfg: FinalizeRenderConfig = Blend.apply({
                    setCss: true,
                    setBounds: true,
                    setStyles: true
                }, config, true, true);
            if (cfg.setCss === true) {
                me.addCssClass(me.config.css);
            }
            if (cfg.setBounds === true) {
                me.setBounds({
                    top: me.config.top,
                    left: me.config.left,
                    width: me.config.width,
                    height: me.config.height
                });
            }
            if (cfg.setStyles === true) {
                me.setStyle(me.config.style);
                if (!me.visible) {
                    // should be set only when not visible
                    me.setVisible(false);
                }
            }
            if (Blend.DEBUG === true) {
                var id = "m" + Blend.newID();
                me.element.getEl().setAttribute("id", id);
                (<any>window)[id] = me;
            }
        }

        /**
        * Retrives the HTMLElement for this Material
        */
        public getElement(finalizeRenderConfig?: FinalizeRenderConfig): Blend.dom.Element {
            var me = this;
            if (!me.isRendered) {
                me.disableEvents();
                me.element = me.render();
                me.isRendered = true;
                me.finalizeRender(finalizeRenderConfig);
                me.enableEvents();
            }
            return me.element;
        }

        /**
         * Destroys this Material by setting the properties to null,
         * deleting them and removing its HTMLElement
         */
        public destroy() {
            var me = this;
            me.element.remove();
            Blend.forEach(me, function (value: any, key: string) {
                (<any>me)[key] = null;
                delete ((<any>me)[key]);
            });
        }

    }
}