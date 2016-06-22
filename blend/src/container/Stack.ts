
/// <reference path="../material/Material.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../Typings.ts" />
/// <reference path="Container.ts" />

namespace Blend.container {

    /**
     * This class implements a container that can stack UI component on top each other.
     * The hosted UI components are stackted into the bounds of this container.
     * The container also accept a padding config which is used to apply a padding
     * the active UI component
     */
    export class Stack extends Blend.container.Fit {

        protected config: StackContainerInterface;
        protected activeItemIndex: number;
        protected activeItem: Blend.material.Material;

        constructor(config: StackContainerInterface = {}) {
            super(config);
            var me = this;
            me.activeItemIndex = me.getItemIndex(config.activeItem || 0);
            me.cssClass = "stack-cntr";
            me.bodyCssClass = "stack-cntr-body";
            me.childCssClass = "stack-cntr-item";
        }

        protected renderBodyElement(): Blend.dom.Element | Blend.dom.ElementConfigBuilder {
            var me = this,
                bodyCb = <Blend.dom.ElementConfigBuilder>super.renderBodyElement();

            me.items.forEach(function (material: Blend.material.Material) {
                material.addCssClass(me.childCssClass);
                bodyCb.addChild(me.getChildElement(material));
            });
            return bodyCb;
        }

        /**
         * Sends notification when the active item is changed
         */
        protected notifyActiveItemChanged(material: Blend.material.Material) {
            var me = this;
            me.activeItem = material;
            me.fireEvent("activeItemChanged", material);
        }

        /**
         * Sets the active item using index, reference, or directly by setting
         * the UI component
         */
        public setActiveItem(item: number | string | Blend.material.Material) {
            var me = this, index = me.getItemIndex(item);
            if (index !== -1) {
                if (me.isRendered) {
                    me.activeItemIndex = index;
                    Blend.forEach(me.items, function (material: Blend.material.Material, itemIndex: number) {
                        if (index === itemIndex) {
                            material.setVisible(true);
                        } else {
                            material.setVisible(false);
                        }
                    });
                } else {
                    me.activeItemIndex = index;
                }
            }
        }

        protected updateLayout() {
            var me = this;
            me.setActiveItem(me.activeItemIndex);
        }

        protected checkComponent(material: Blend.material.Material): boolean {
            material.setVisible(false);
            return true;
        }

        protected getItemIndex(item: number | string | Blend.material.Material): number {
            var me = this, result: number = -1;
            if (Blend.isNumeric(item)) {
                result = <number>item;
            } else {
                Blend.forEach(me.items, function (material: Blend.material.Material, index: number) {
                    if (Blend.isString(item) && material.getReference() === <string>item) {
                        result = index;
                        return false;
                    } else if (<Blend.material.Material>item === material) {
                        result = index;
                        return false;
                    }
                });
            }
            return result;
        }
    }
}

Blend.registerClassWithAlias("lay.stack", Blend.container.Stack);