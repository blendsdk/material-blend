/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Component.ts" />
/// <reference path="Context.ts" />
/// <reference path="Controller.ts" />

namespace Blend.mvc {
    /**
     * Provides a generic mvc View
     */
    export class View extends Blend.Component {

        protected parent: Blend.mvc.View;
        protected controllers: Array<Blend.mvc.Controller>;
        protected mvcReady: boolean;
        protected reference: string;

        public constructor(config: MvcViewInterface = {}) {
            super(config);
            var me = this;
            me.controllers = [];
            me.mvcReady = false;
            me.reference = config.reference || null;
            me.setParent(config.parent || null);
        }

        /**
         *  Assigned a parent View and initialized the controller event chain
         */
        public setParent(view: Blend.mvc.View) {
            var me = this;
            if (me.parent === null && view !== null) {
                me.parent = view;
                me.initControllerChain();
            }
        }

        private initControllers() {
            var me = this;
            Blend.forEach(Blend.wrapInArray(me.config.controllers || []), function(ctrl: ComponentClass) {
                if (Blend.isClass(ctrl)) {
                    me.controllers.push(<Blend.mvc.Controller>Blend.createComponent(ctrl));
                }
            });
        }

        /**
         * Retrives the current controllers
         */
        public getControllers(): Array<Blend.mvc.Controller> {
            return this.controllers;
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
        }

        /**
         * This function will try to find any Controllers within the parent View chain
         * if this View has a reference.
         */
        private resolveControllers(): void {
            var me = this;
            if (me.reference !== null && me.parent !== null) {
                var view: View = me.parent,
                    search: boolean = true;
                while (search && view) {
                    if (view.hasControllers()) {
                        me.controllers.concat(view.controllers);
                        search = false;
                    } else {
                        view = view.parent;
                    }
                }
            }
        }
        /**
         * Provides information if the View has any Controllers.
         */
        public hasControllers(): boolean {
            var me = this;
            return (me.controllers && me.controllers.length !== 0);
        }

        /**
         * Initializes the event chain for this View
         * @internal
         */
        initControllerChain() {
            var me = this;
            if (!me.mvcReady) {
                me.resolveControllers();
                Blend.forEach(me.controllers, function(ctrl: Blend.mvc.Controller) {
                    ctrl.bindView(me.reference, me);
                });
                me.mvcReady = true;
            }
        }
    }
}