/// <reference path="View.ts" />

namespace Blend.ui {

    export interface RectangleConfig extends UIViewInterface {
    }

    export class Rectangle extends Blend.ui.View {

        protected config: RectangleConfig;
        constructor(config: RectangleConfig = {}) {
            super(config);
            var me = this;
            me.cssClass = 'rectangle';
        }

    }
}