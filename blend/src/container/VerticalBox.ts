/// <reference path="../common/Interfaces.ts" />
/// <reference path="../ui/BoxContainerView.ts" />
/// <reference path="../ui/BoxProcessor.ts" />

namespace Blend.container {

    export class VerticalBox extends Blend.ui.BoxContainerView {

        constructor(config: BoxContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = 'vbox-container';
            me.itemCSSClass = cssPrefix(me.cssClass + '-item');
            me.boxedProperty = 'height';
            me.sizeProperty = 'width';
            me.marginBeforeProperty = 'top';
            me.marginAfterProperty = 'bottom';
            me.boxProcessor = new Blend.ui.VBoxProcessor();
            me.direction = config.direction || eBoxLayoutDirection.TopToBottom;
        }
    }
}

namespace Blend {
    registerClassWithAlias('layout.vbox', Blend.container.VerticalBox);
}
