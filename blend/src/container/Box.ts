/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../ui/BoxContainerView.ts" />
/// <reference path="../ui/BoxProcessor.ts" />

namespace Blend.container {

    export class Box extends Blend.ui.BoxContainerView {

        protected boxType: eBoxType;

        constructor(config: BoxContainerInterface = {}) {
            super(config);
            var me = this;
            me.initBoxProcessor(config.boxType || eBoxType.hbox, config);
        }

        protected initBoxProcessor(boxType: eBoxType | string, config: BoxContainerInterface): eBoxType {
            var me = this;
            boxType = Blend.parseEnum<number>(eBoxType, boxType);
            if (boxType === eBoxType.hbox) {
                me.cssClass = 'hbox-container';
                me.itemCSSClass = cssPrefix(me.cssClass + '-item');
                me.boxedProperty = 'width';
                me.sizeProperty = 'height';
                me.marginBeforeProperty = 'left';
                me.marginAfterProperty = 'right';
                me.boxProcessor = new Blend.ui.HBoxProcessor();
                me.direction = config.direction || eBoxLayoutDirection.LeftToRight;
            } else {
                me.cssClass = 'vbox-container';
                me.itemCSSClass = cssPrefix(me.cssClass + '-item');
                me.boxedProperty = 'height';
                me.sizeProperty = 'width';
                me.marginBeforeProperty = 'top';
                me.marginAfterProperty = 'bottom';
                me.boxProcessor = new Blend.ui.VBoxProcessor();
                me.direction = config.direction || eBoxLayoutDirection.TopToBottom;
            }
            return <eBoxType>boxType;
        }
    }
}

namespace Blend {
    registerClassWithAlias('layout.box', Blend.container.Box);
}