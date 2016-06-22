namespace Blend.container {

    /**
     * This class implements a container that can host a single UI component.
     * The hosted UI component is fitted into the bounds of this container.
     * The container also accept a padding config which is used to apply a padding
     * the child UI component
     */
    export class Fit extends Blend.container.Container {

        protected config: FitContainerInterface;

        constructor(config: FitContainerInterface = {}) {
            super(config);
            var me = this;
            me.config = Blend.apply(me.config, {
                padding: config.padding || 0
            }, true);
            me.cssClass = "fit-cntr";
            me.bodyCssClass = "fit-cntr-body";
            me.childCssClass = "fit-cntr-item";
        }

        protected getChildElement(materail: Blend.material.Material): Blend.dom.Element {
            // Override to prevent the child component setting its own bounds
            return materail.getElement({
                setBounds: false
            });
        }

        protected checkComponent(material: Blend.material.Material): boolean {
            // override to only add one UI component
            return this.items.length === 0;
        }

        protected renderBodyElement(): Blend.dom.Element | Blend.dom.ElementConfigBuilder {
            var me = this,
                bodyCb = <Blend.dom.ElementConfigBuilder>super.renderBodyElement();

            if (me.items.length !== 0) {
                var itm = me.items[0];
                itm.addCssClass(me.childCssClass);
                bodyCb.addChild(me.getChildElement(itm));
            }
            return bodyCb;
        }

        protected render(): Blend.dom.Element {
            var me = this,
                cb = new Blend.dom.ElementConfigBuilder({
                    cls: [me.cssClass]
                });

            if (me.config.padding !== 0) {
                cb.setStyle({ "padding": me.config.padding });
            }
            cb.addChild(me.renderBodyElement());
            return Blend.createElement(cb, me.assignElementByOID);
        }

        public setPadding(value: number | string): Blend.container.Fit {
            var me = this;
            if (me.isRendered) {
                me.element.setStyle({
                    padding: value
                });
            }
            me.config.padding = value;
            return this;
        }
    }
}

Blend.registerClassWithAlias("lay.fit", Blend.container.Fit);