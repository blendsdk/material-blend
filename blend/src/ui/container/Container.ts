/// <reference path="../../common/Interfaces.ts" />
/// <reference path="../ContainerViewBase.ts" />

namespace Blend.ui.container {

    export class Container extends Blend.ui.ContainerViewBase {

        constructor(config: UIContainerViewInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = "container";
            me.itemCSSClass = cssPrefix(me.cssClass + '-item');
        }

        protected render(): Blend.dom.Element {
            var me = this;
            return Blend.dom.Element.create({
                children: [me.renderBodyElement()]
            });
        }
    }

}