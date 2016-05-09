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
            me.cssClass = 'b-gc';
            me.itemCSSClass = me.cssClass + '-itm';
            me.gridRows = [];
        }

        protected renderChild(view: Blend.ui.View): Blend.dom.Element {
            var me = this,
                row: Blend.dom.Element,
                viewEl: Blend.dom.Element,
                gridConfig: GridItemInterface = view.getProperty<GridItemInterface>('config.grid', null);

            if (gridConfig !== null) {
                row = me.gridRows[gridConfig.row || 0] || me.gridRows[0] || null;
                if (row == null) {
                    row = Blend.dom.Element.create({ cls: 'b-grd-r' });
                    me.gridRows.push(row);
                    me.bodyElement.append(row);
                }
                viewEl = view.getElement();
                viewEl.setData('grid-column', (gridConfig.col || 0));
                view.setStyle({ width: null});
                row.append(viewEl);
                return row;
            } else {
                throw new Error('Items ina Grid container must have a "grid" configuration!')
            }
        }

        protected finalizeRender() {
            var me = this;
            super.finalizeRender();
            me.bodyElement.addCssClass('grd');
        }
    }
}

namespace Blend {
    registerClassWithAlias('layout.grid', Blend.container.Grid);
}