/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="Controller.ts" />


namespace Blend.mvc {

    /**
     * Represents a context that hols instanses of controllers an other
     *  mvc related state
     */
    export class Context {

        private controllers: Array<Blend.mvc.Controller>;

        constructor() {
            var me = this;
            me.controllers = [];
        }

        public addController(ctrl: Blend.mvc.Controller | Array<Blend.mvc.Controller>) {
            this.controllers.concat(Blend.wrapInArray<Controller>(ctrl));
        }

        delegate(eventName: string, reference: string, view: View, args: any[]) {
            var me = this;
            Blend.forEach(me.controllers, function(ctrl: Blend.mvc.Controller) {
                ctrl.delegate(eventName, reference, view, args);
            });
        }

    }

}
