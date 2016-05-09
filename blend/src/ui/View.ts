/// <reference path="Layoutable.ts" />
/// <reference path="../dom/Element.ts" />


namespace Blend.ui {

    /**
     * Common baseclass for a UI View component
     */
    export class View extends Blend.ui.Layoutable {

        /**
         * Helper method to the the Grdi column size when this View is part
         * of a Blend.container.Grid
         */
        public setGridColumn(size: number) {
            var me = this;
            me.element.removeCssClassLike('b-grd-c').addCssClass('b-grd-c' + size);
        }

    }
}