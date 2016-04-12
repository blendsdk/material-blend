/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Component.ts" />
/// <reference path="Context.ts" />
/// <reference path="View.ts" />

interface ControllerEventHandler {
    (view: Blend.mvc.View, ...args: any[]): void
}

module Blend.mvc {

    /**
     * Base class for a Controller. When creating a new controller, if you
     * provide a globalId to the constructor the the Controller is going
     * to be registers in the global Blend.mvc.Context and it can be used
     * from Views that are not in the same View hierarchy.
     */
    export class Controller extends Blend.Component {

        private references: DictionaryInterface = {}
        private handlers: DictionaryInterface = {}

        /**
         * Retuns one or more references of a view registered in the controller
         */
        protected getReference<T>(name: string): T {
            var me = this, v: T | Array<T>;
            v = me.references[name] || null;
            if (v) {
                if (Blend.isArray(v) && (<Array<T>>v).length === 1) {
                    return <T>(<Array<T>>v)[0];
                } else {
                    return <T>v;
                }
            } else {
                return null;
            }
        }

        /**
         * @internal
         * Delegates an event to the regisreted handlers in this controller
         */
        delegate(eventName: string, reference: string, view: View, args: any[]) {
            var me = this,
                handlers = me.handlers[eventName] || me.handlers[(reference || '') + '.' + eventName] || null;
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
        bindView(reference: string, view: View): void {
            if (!this.references[reference]) {
                this.references[reference] = [view];
            } else {
                this.references[reference].push(view);
            }
        }
    }
}