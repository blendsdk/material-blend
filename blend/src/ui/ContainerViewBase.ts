/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="View.ts" />



namespace Blend.ui {

    /**
     * Common baseclass for a UI View component
     */
    export class ContainerViewBase extends Blend.ui.View {

        protected items: Array<Blend.ui.View | Blend.ui.ContainerViewBase>;
        protected bodyElement: Blend.dom.Element;
        protected itemCSSClass: string;

        public constructor(config: UIContainerViewInterface = {}) {
            super(config);
            var me = this;
            me.itemCSSClass = cssPrefix(me.cssClass + '-item');
            me.addView(config.items || []);
        }

        public addView(item: UIType | Array<UIType>) {
            var me = this;
            Blend.forEach(Blend.wrapInArray(item), function(itm: UIType) {
                var view: Blend.ui.View = Blend.createComponent<Blend.ui.View>(itm, {
                    parent: me,
                    css: [me.itemCSSClass]
                });
                if (view.getProperty<boolean>('useParentController') === true) {
                    view.addController(me.controllers);
                }
                me.items.push(view);
                if (me.isRendered) {
                    me.bodyElement.append(view.getElement());
                }
            });
        }

        protected renderChild(view: Blend.ui.ViewBase): Blend.dom.Element {
            return view.getElement();
        }

        protected renderChildren(): Array<Blend.dom.Element> {
            var me = this,
                children: Array<Blend.dom.Element> = [];
            me.items.forEach(function(view: Blend.ui.ViewBase) {
                children.push(me.renderChild(view));
            });
            return children;
        }

        protected renderBodyElement(): Blend.dom.Element {
            var me = this;
            return this.bodyElement
                = Blend.dom.Element.create({
                    cls: cssPrefix(me.cssClass + '-items'),
                    children: me.renderChildren()
                });
        }

    }
}