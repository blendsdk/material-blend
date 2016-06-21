/// <reference path="Toolbar.ts" />

namespace Blend.toolbar {

    export class Application extends Blend.toolbar.Toolbar {

        protected finalizeRender() {
            var me = this;
            super.finalizeRender();
            me.addCssClass("mb-tbar-application");
        }
    }
}