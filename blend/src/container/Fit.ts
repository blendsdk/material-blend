/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../ui/PaddableContainer.ts" />

namespace Blend.container {

    export class Fit extends Blend.ui.PaddableContainer {

        protected config: FitContainerInterface;
        protected fittedView: Blend.ui.View;

        public constructor(config: FitContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = 'fit-container';
            me.itemCSSClass = cssPrefix(me.cssClass + '-item');
            me.fittedView = null;
        }

        protected layoutView() {
            var me = this;
            if (me.fittedView) {
                // first time cleanup
                me.fittedView.setBounds({ top: null, left: null, width: null, height: null });
                me.fittedView.setStyle({ display: null });
            }
            me.performLayoutChildren();
        }

        protected render(): Blend.dom.Element {
            var me = this;
            return Blend.dom.Element.create({
                children: [me.renderBodyElement()]
            });
        }

        public addView(item: UIType | Array<UIType>) {
            var me = this;
            if (me.items.length === 0) {
                super.addView.apply(me, arguments);
                me.fittedView = me.items[0];
            } else {
                throw new Error('Fit container can only have one child view!');
            }
        }
    }

}