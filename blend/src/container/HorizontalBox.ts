/// <reference path="../common/Interfaces.ts" />
/// <reference path="../ui/BoxContainerView.ts" />
/// <reference path="../ui/BoxProcessor.ts" />

namespace Blend.container {

    export class HorizontalBox extends Blend.ui.BoxContainerView {

        constructor(config: BoxContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = 'hbox-container';
            me.itemCSSClass = cssPrefix(me.cssClass + '-item');
            me.boxedProperty = 'width';
            me.sizeProperty = 'height';
            me.marginBeforeProperty = 'left';
            me.marginAfterProperty = 'right';
            me.boxProcessor = new Blend.ui.HBoxProcessor();
            me.direction = config.direction || eBoxLayoutDirection.LeftToRight;
        }
    }
}

namespace Blend {
    registerClassWithAlias('layout.hbox', Blend.container.HorizontalBox);
}