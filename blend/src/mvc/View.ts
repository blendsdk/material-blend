/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../Component.ts" />

namespace Blend.mvc {

    export class View extends Blend.Component {

        protected controllers: Array<Blend.mvc.Controller>;
        private reference: string;
        private context: Blend.mvc.Context;

        public constructor(config: MvcViewInterface = {}) {
            super(config);
            var me = this;
            me.controllers = [];
            me.reference = config.reference || null;
            me.addController(config.controller || []);
        }

        /**
         * Fires an event towards the Controllers within this View
         */
        protected fireEvent(eventName: string, ...args: any[]) {
            var me = this,
                controller: Controller;
            if (me.controllers) {
                Blend.forEach(me.controllers, function(controllerItem: Controller) {
                    controller.delegate(eventName, me.reference, me, args);
                });
            }
            if (me.context !== null) {
                me.context.delegate(eventName, me.reference, me, args);
            }
        }

        public addController(controllers:ControllerType|Array<ControllerType>) {
            var me = this,
                ctrl: Controller;
            Blend.forEach(controllers, function(item: ControllerType) {
                if (Blend.isClass(item) || Blend.isString(item)) {
                    ctrl = <Controller>Blend.createComponent(item);
                } else if (Blend.isObject(item)) {
                    ctrl = <Controller>item;
                }
                if (Blend.isInstanceOf(ctrl, Blend.mvc.Controller)) {
                    ctrl.bindView(me.reference, me);
                    me.controllers.push(ctrl);
                } else {
                    throw new Error(`${ctrl} is not a valid Blend.mvc.Controller`);
                }
            });
        }
    }
}