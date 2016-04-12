/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../Component.ts" />
/// <reference path="Context.ts" />



namespace Blend.mvc {

    export class Application extends Blend.Component {

        private mvcContext: Context;

        public constructor(config: any = {}) {
            super(config);
            var me = this;
            me.mvcContext = new Blend.mvc.Context();
        }

        public addController(ctrl: Blend.mvc.Controller | Array<Blend.mvc.Controller>) {
            this.mvcContext.addController(ctrl);
        }

    }

}
