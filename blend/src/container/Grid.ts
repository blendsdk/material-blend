/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../ui/Container.ts" />

namespace Blend.container {

    /**
     * This container can be used to implement a Responsive grid
     */
    export class Grid extends Blend.ui.Container {

        protected config: GridContainerInterface

        public constructor(config: GridContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = 'grid-container';
            me.itemCSSClass = cssPrefix(me.cssClass + '-item');
        }

    }
}

namespace Blend {
    registerClassWithAlias('layout.grid', Blend.container.Grid);
}