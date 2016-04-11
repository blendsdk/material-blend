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
            me.reference = null;
            me.parent = null;
        }

        private initControllers() {
            var me = this;
            Blend.forEach(Blend.wrapInArray(me.config.controllers || []), function(ctrl: ComponentClass) {
                if (Blend.isClass(ctrl)) {
                    me.controllers.push(<Blend.mvc.Controller>Blend.createComponent(ctrl, {
                        hostView:me
                    }));
                }
            });
        }

        public getControllers(): Array<Blend.mvc.Controller> {
            return this.controllers;
        }

        /**
         * Initializes the event chain for this View
         * @internal
         */
        initControllerChain(parentView?:View) {
            var me = this;
            if (!me.mvcReady) {
                me.initControllers();
                if(parentView !== null && me.parent === null) {
                    me.parent = parentView;
                    if (me.reference !== null) {
                        Blend.forEach(me.parent.getControllers, function(ctrl: Blend.mvc.Controller) {
                            ctrl.bindView(me.reference,me);
                        });
                        me.controllers.concat(me.parent.getControllers());
                    }
                }
                me.mvcReady = true;
            }
        }
    }
}