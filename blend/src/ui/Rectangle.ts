/// <reference path="../Blend.ts" />
/// <reference path="View.ts" />

namespace Blend.ui {

    export interface RectangleConfig extends UIViewInterface {
        color?: string
        border?: boolean
    }

    export class Rectangle extends Blend.ui.View {

        protected config: RectangleConfig;
        constructor(config: RectangleConfig = {}) {
            super(config);
            var me = this;
            me.cssClass = 'rectangle';
            me.setBounds({
                width: config.width || 100,
                height: config.height || 100
            })
            me.setStyle({
                'background-color': config.color || 'transparent',
                'border': config.border == true ? '1px solid #000' : null,
                display: 'inline-block'
            });
        }

    }

    registerClassWithAlias('ui.rect', Blend.ui.Rectangle);
}