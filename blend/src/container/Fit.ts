/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../ui/PaddableContainer.ts" />

namespace Blend.container {

    /**
     * A container that can 100% fit a child View with possibility
     * to apply a padding to the container body
     */
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
                me.fittedView.suspendLayout();
                me.fittedView.disableEvents();
                me.fittedView.setBounds(null)
                me.fittedView.setVisible(true);
                me.fittedView.enableEvents();
                me.fittedView.resumeLayout();
            }
            me.performLayoutChildren();
        }

        public addView(item: UIType | Array<UIType>) {
            var me = this;
            if (me.items.length === 0) {
                super.addView(item);
                me.fittedView = me.items[0];
            } else {
                throw new Error('Fit container can only have one child view!');
            }
        }
    }
}

namespace Blend {
    registerClassWithAlias('layout.fit', Blend.container.Fit);
}