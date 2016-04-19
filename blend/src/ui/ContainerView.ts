/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="View.ts" />

namespace Blend.ui {

    /**
     * Common baseclass for a UI View component
     */
    export abstract class ContainerView extends Blend.ui.View {

        protected items: Array<Blend.ui.View | Blend.ui.ContainerView>;
        protected bodyElement: Blend.dom.Element;
        protected itemCSSClass: string;
        protected config: UIContainerViewInterface;

        public constructor(config: UIContainerViewInterface = {}) {
            super(config);
            var me = this;
            me.items = [];
            me.addLayoutTriggerEvent(['itemAdded', 'itemRemoved']);
            me.config.items = config.items || [];
        }

        public getItems() {
            return this.items;
        }

        protected performLayoutChildren() {
            var me = this;
            Blend.forEach(me.items, function(view: Blend.ui.View, index: number) {
                me.layoutChild(view, index);
            });
        }

        protected layoutView() {
            var me = this;
            me.performLayoutChildren();
        }

        protected layoutChild(view: Blend.ui.View, index: number) {
            view.performLayout();
        }

        protected renderAddedView(view: Blend.ui.View): boolean {
            var me = this;
            if (me.isRendered) {
                me.bodyElement.append(view.getElement());
                me.invalidateLayout(true);
                return true;
            } else {
                return false;
            }
        }

        /**
         * Adds one or more Views to this Conatiner
         */
        public addView(item: UIType | Array<UIType>) {
            var me = this, view: Blend.ui.View;
            Blend.forEach(Blend.wrapInArray(item), function(itm: UIType) {
                view = me.createViewItem(itm);
                me.items.push(view);
                me.renderAddedView(view);
                me.notifyItemAdded(view);
            });
        }

        /**
         * Creates a View item to be added to the items collection
         */
        protected createViewItem(itm: UIType): Blend.ui.View {
            var me = this;
            var view: Blend.ui.View = Blend.createComponent<Blend.ui.View>(itm, {
                parent: me,
                css: [me.itemCSSClass]
            });
            if (view.getProperty<boolean>('useParentController', true) === true) {
                view.addController(me.controllers);
            }
            return view;
        }

        protected renderRemovedView(view: Blend.ui.View): boolean {
            var me = this;
            if (me.isRendered) {
                view.getElement().remove();
                me.invalidateLayout(true);
                return true;
            } else {
                return false;
            }
        }

        /**
         * Removed a View from this container
         */
        public removeView(view: number | Blend.ui.View): Blend.ui.View {
            var me = this,
                index: number = Blend.isObject(view) ? me.items.indexOf(<any>view) : <number>view,
                removed: Array<Blend.ui.View> = me.items.splice(index, 1);
            if (removed.length !== 0) {
                me.renderRemovedView(removed[0]);
                me.notifyItemRemoved(removed[0])
                return removed[0];
            } else {
                return null;
            }
        }

        /**
         * Sends an itemRemoved notification
         */
        protected notifyItemRemoved(view: Blend.ui.View) {
            var me = this;
            me.fireEvent('itemRemoved', view);
        }

        /**
         * Sends an itemAdded notification
         */
        protected notifyItemAdded(view: Blend.ui.View) {
            var me = this;
            me.fireEvent('itemAdded', view);
        }

        protected renderChild(view: Blend.ui.View): Blend.dom.Element {
            return view.getElement();
        }

        protected renderChildren(): Array<Blend.dom.Element> {
            var me = this,
                children: Array<Blend.dom.Element> = [];
            me.addView(me.config.items);
            me.items.forEach(function(view: Blend.ui.View) {
                children.push(me.renderChild(view));
            });
            return children;
        }

        protected renderBodyElement(): Blend.dom.Element {
            var me = this;
            return this.bodyElement
                = Blend.dom.Element.create({
                    cls: cssPrefix(me.cssClass + '-body'),
                    children: me.renderChildren()
                });
        }

        protected render(): Blend.dom.Element {
            var me = this;
            return Blend.dom.Element.create({
                children: [me.renderBodyElement()]
            });
        }
    }
}