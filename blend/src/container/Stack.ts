/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../ui/Container.ts" />

namespace Blend.container {

    /**
     * This container can be used to stack Views on top of eachother
     * showing only one View at a time
     */
    export class Stack extends Blend.ui.Container {

        protected config: StackContainerInterface
        protected activeView: Blend.ui.View

        public constructor(config: StackContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = 'b-sc';
            me.itemCSSClass = me.cssClass + '-itm';
            me.activeView = null;
            me.addLayoutTriggerEvent('activeViewChanged');
            me.setActiveView(config.activeView || 0);
        }

        protected initialize() {
            var me = this;
            me.setActiveView(me.config.activeView);
        }

        /**
         * Returns the current active view
         */
        public getActiveView(): Blend.ui.View {
            return this.activeView;
        }

        /**
         * Set the active view of this Stack container
         */
        public setActiveView(view: number | string | Blend.ui.View) {
            var me = this;
            if (me.isRendered) {
                me.activeView = me.findView(view);
                if (me.activeView) {
                    me.activeView.suspendLayout()
                        .disableEvents();
                    me.activeView.setBounds(null);
                    me.activeView.getElement();
                    me.activeView.setStyle({
                        'z-index': me.items.length
                    });
                    me.activeView.setVisible(true)
                    me.activeView.resumeLayout()
                        .enableEvents();
                    me.notifyActiveViewChanged();
                    me.items.forEach(function(itm: Blend.ui.View) {
                        if (itm !== me.activeView) {
                            itm.suspendLayout()
                                .disableEvents();
                            itm.setStyle({
                                'z-index': -1,
                                width: 1,
                            });
                            itm.setVisible(false);
                            itm.resumeLayout()
                                .enableEvents();
                        }
                    });
                }
            } else {
                me.config.activeView = 0;
            }
        }

        /**
         * Sends a visibilityChanged notification
         */
        protected notifyActiveViewChanged() {
            var me = this;
            me.invalidateLayout(false)
                .fireEvent('activeViewChanged', me.activeView);
        }

        /**
         * Find a View by its index, reference, or object
          */
        protected findView(view: number | string | Blend.ui.View): Blend.ui.View {
            var me = this,
                v: Blend.ui.View = null;
            Blend.forEach(me.items, function(item: Blend.ui.View, index: number) {
                if (Blend.isNumeric(view) && <number>view === index) {
                    v = item;
                    return false;
                } else if (Blend.isInstanceOf(view, Blend.ui.View) && <Blend.ui.View>view === item) {
                    v = item;
                    return;
                } else if (Blend.isString(view) && <string>view === item.getReference()) {
                    v = item;
                    return;
                }
            });
            return v;
        }

        /**
         * Override to layouts only the active view
         */
        protected layoutChild(view: Blend.ui.View) {
            var me = this;
            if (view === me.activeView) {
                view.performLayout();
            }
        }

    }
}

namespace Blend {
    registerClassWithAlias('layout.stack', Blend.container.Stack);
}