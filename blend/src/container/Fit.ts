namespace Blend.container {

    /**
     * This class implements a container that can host a single UI component.
     * The hosted UI component is fitted into the bounds of this container.
     * The container also accept a padding config which is used to apply a padding
     * the child UI component
     */
    export class Fit extends Blend.container.Container {

        constructor(config: FitContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = "fit-cntr";
            me.bodyCssClass = "fit-cntr-body";
            me.childCssClass = "fit-cntr-item";
        }

        protected renderChildElement(materail: Blend.material.Material): Blend.dom.Element {
            // Override to prevent the child component setting its own bounds
            return materail.getElement({
                setBounds: false
            });
        }

        protected checkComponent(material: Blend.material.Material): boolean {
            // override to only add one UI component
            return this.items.length === 0;
        }

        protected renderChildren(): Array<Blend.dom.Element | Blend.dom.ElementConfigBuilder> {
            var me = this,
                list: Array<Blend.dom.Element> = [];
            if (me.items.length !== 0) {
                var itm = me.items[0];
                itm.addCssClass(me.childCssClass);
                list.push(me.renderChildElement(itm));
            }
            return list;
        }
    }
}

Blend.registerClassWithAlias("lay.fit", Blend.container.Fit);