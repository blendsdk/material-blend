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
        protected gridRows: Array<Blend.dom.Element>;

        public constructor(config: GridContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = 'grid-container';
            me.itemCSSClass = cssPrefix(me.cssClass + '-item');
            me.gridRows = [];
        }

        protected renderChild(view: Blend.ui.View): Blend.dom.Element {
            var me = this,gridConfig = view.getProperty('grid', null);
            if (gridConfig !== null) {

            } else {
                throw new Error('Items ina Grid container must have a "grid" configuration!')
            }
            return view.getElement();
        }


    }
}

namespace Blend {
    registerClassWithAlias('layout.grid', Blend.container.Grid);
}