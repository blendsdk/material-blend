/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../ui/PaddableContainer.ts" />

namespace Blend.container {

    export class Stack extends Blend.ui.PaddableContainer {

        protected config: StackContainerInterface

        public constructor(config: FitContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = 'stack-container';
            me.itemCSSClass = cssPrefix(me.cssClass + '-item');
        }

        protected layoutView() {
            var me = this;
            me.performLayoutChildren();
        }

        protected render(): Blend.dom.Element {
            var me = this;
            return Blend.dom.Element.create({
                children: [me.renderBodyElement()]
            });
        }
    }

}