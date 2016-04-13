/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="View.ts" />



namespace Blend.ui {

    /**
     * Common baseclass for a UI View component
     */
    export class ContainerViewBase extends Blend.ui.View {

        protected items: Array<Blend.ui.ViewBase | Blend.ui.ContainerViewBase>;
        protected bodyElement: Blend.dom.Element;
        protected itemCSSClass: string;
        protected config: UIContainerViewInterface;

        public constructor(config: UIContainerViewInterface = {}) {
            super(config);
            var me = this;
            me.items = [];
            me.layoutTriggers.push('itemAdded');
            me.layoutTriggers.push('itemRemoved');
            me.config.items = config.items || [];
        }

        public addView(item: UIType | Array<UIType>) {
            var me = this, view: Blend.ui.ViewBase;
            Blend.forEach(Blend.wrapInArray(item), function(itm: UIType) {
                view = me.createViewItem(itm);
                me.items.push(view);
                me.notifyItemAdded(view);
            });
        }

        /**
         * Creates a View item to be added to the items collection
         */
        protected createViewItem(itm: UIType): Blend.ui.ViewBase {
            var me = this;
            var view: Blend.ui.View = Blend.createComponent<Blend.ui.View>(itm, {
                parent: me,
                css: [me.itemCSSClass]
            });
            if (view.getProperty<boolean>('useParentController') === true) {
                view.addController(me.controllers);
            }
            return view;
        }

        /**
         * Removed a View from this container
         */
        public removeView(view: number | Blend.ui.ViewBase): Blend.ui.ViewBase {
            var me = this,
                index: number = Blend.isObject(view) ? me.items.indexOf(<any>view) : <number>view,
                removed: Array<Blend.ui.ViewBase> = me.items.splice(index, 1);
            if (removed.length !== 0) {
                me.notifyItemRemoved(removed[0])
                return removed[0];
            } else {
                return null;
            }
        }

        /**
         * Sends an itemRemoved notification
         */
        protected notifyItemRemoved(view: Blend.ui.ViewBase) {
            var me = this;
            me.fireEvent('itemRemoved', view);
        }

        /**
         * Sends an itemAdded notification
         */
        protected notifyItemAdded(view: Blend.ui.ViewBase) {
            var me = this;
            me.fireEvent('itemAdded', view);
        }

        protected renderChild(view: Blend.ui.ViewBase): Blend.dom.Element {
            return view.getElement();
        }

        protected renderChildren(): Array<Blend.dom.Element> {
            var me = this,
                children: Array<Blend.dom.Element> = [];
            me.addView(me.config.items);
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