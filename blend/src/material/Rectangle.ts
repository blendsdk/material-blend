/// <reference path="../Blend.ts" />
/// <reference path="Material.ts" />

interface RectangleInterface extends MaterialInterface {
    color?: string
    border?: boolean
}

namespace Blend.material {

    export class Rectangle extends Blend.material.Material {

        protected config: RectangleInterface;
        private layoutCount: number;

        constructor(config: RectangleInterface = {}) {
            super(config);
            var me = this;
            me.setBounds({
                width: config.width || 100,
                height: config.height || 100
            })
            me.setStyle({
                'background-color': config.color || 'transparent',
                'border': config.border == true ? '1px solid #000' : null
            });
            me.layoutCount = 0;
        }

        protected layoutView() {
            var me = this;
            me.layoutCount++;
            //me.log();
        }

        protected finalizeRender() {
            var me = this;
            super.finalizeRender();
            me.addCssClass('m-rectangle');
        }

        private log() {
            var me = this;
            me.element.setHtml(`<pre>Layouts: ${me.layoutCount}</pre>`);
        }

    }

    registerClassWithAlias('mb.rect', Blend.material.Rectangle);
}