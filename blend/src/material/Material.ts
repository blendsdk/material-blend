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
                Blend.forEach(config, function(queries: Array<string>, alias: string) {
                    queries = Blend.wrapInArray<string>(queries);
                    queries.forEach(function(mediaQuery: string) {
                        Blend.Runtime.addMediaQueryListener(mediaQuery, function(mql: MediaQueryList) {
                            me.fireEvent('responsiveChanged', alias, mql);
                        });
                    });
                });
            }
        }

        public getProperty<T>(name: string, defaultValue: any = null): T {
            var me: any = this;
            if (name.indexOf('config.', 0) === 0) {
                name = name.replace('config.', '').trim();
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
            var me = this
            me.fireEvent('materialInitialized', me);
        }

        /**
         * DO NOT USE THIS FUNCTION!
         * Internal function that is called by the parent/host to initiate
         * the initialization process
          */
        public doInitialize() {
            var me = this;
            me.initialize();
            me.notifyMaterialInitialized();
        }

        /**
         * This function can be overriden to do custom initialization on this Material
         */
        public initialize() {

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
            if (state === false && me.currentEventName === 'materialInitialized') {
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
                me.fireEvent('boundsChanged', me.getBounds());
            }
        }


        /////////////////////////////////////////////////////////////////////////
        // VISIBILITY
        //////////////////////////////////////////////////////////////////////////

        /**
         * Sets the visibility state for this Material
         */
        setVisible(visible: boolean = true): Blend.material.Material {
            var me = this
            me.visible = visible === true ? true : false;
            if (me.isRendered) {
                me.element.setData('visible', me.visible);
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
            me.fireEvent('visibilityChanged', me.visible);
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
                Blend.wrapInArray(css).forEach(function(itm: string) {
                    (<Array<string>>me.config.css).push(itm)
                });
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
         *Helps configuring the this Material before the rendering cycle is complete
         */
        protected finalizeRender() {
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
        }

        /**
        * Retrives the HTMLElement for this Material
        */
        public getElement(): Blend.dom.Element {
            var me = this;
            if (!me.isRendered) {
                me.disableEvents();
                me.element = me.render();
                me.isRendered = true;
                me.finalizeRender();
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
            Blend.forEach(me, function(value: any, key: string) {
                (<any>me)[key] = null;
                delete ((<any>me)[key]);
            });
        }

    }
}