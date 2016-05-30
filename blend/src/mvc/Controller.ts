/// <reference path="../typings.ts" />
/// <reference path="../Component.ts" />
/// <reference path="View.ts" />
/// <reference path="Client.ts" />

interface ControllerEventHandler {
    (view: Blend.mvc.View, ...args: any[]): void
}

module Blend.mvc {

    /**
     * Base class for a Controller.
     */
    export class Controller extends Blend.Component {

        private handlers: DictionaryInterface = {}

        public constructor(config: any = {}) {
            super(config);
            this.initEvents();
        }

        protected initEvents() {

        }

        /**
         * @internal
         * Delegates an event to the regisreted handlers in this controller
         */
        delegate(eventName: string, view: Client, args: any[]) {
            var me = this,
                reference = (<any>view).getReference ? (<any>view).getReference() : '',
                handlers = me.handlers[eventName] || me.handlers[reference + '.' + eventName] || null;
            if (handlers && handlers.length !== 0) {
                handlers.forEach(function(handler: ControllerEventHandler) {
                    setTimeout(function() {
                        try {
                            handler.apply(me, [view].concat(args));
                        } catch (error) {
                        }
                    }, 2);

                });
            }
        }

        /**
         * Registers an event handler within this controller
         */
        protected on(eventName: string, handler: ControllerEventHandler): void {
            var me = this;
            if (!me.handlers[eventName]) {
                me.handlers[eventName] = [handler];
            } else {
                me.handlers[eventName].push(handler);
            }
        }

        /**
         * @internal
         * Registers a View's reference within this controller
         */
        bindView(view: Client | View): void {
            var me: any = this,
                reference = ((<View>view).getReference ? (<View>view).getReference() : null); // trick to bypass the Context object
            if (reference !== null) {
                if (me[reference] === null) {
                    me[reference] = view;
                } else if (Blend.isArray(me[reference])) {
                    (<Array<Blend.mvc.View>>me[reference]).push(<View>view);
                }

            }
        }
    }
}