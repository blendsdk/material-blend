
/// <reference path="../material/Material.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../Typings.ts" />
/// <reference path="Container.ts" />

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
        }

        protected getChildElement(materail: Blend.material.Material): Blend.dom.Element {
            // Override to prevent the child component setting its own bounds
            return materail.getElement({
                setBounds: false
            });
        }

        protected render(): Blend.dom.Element {
            var me = this,
                cb = new Blend.dom.ElementConfigBuilder({
                    cls: ["fit-cntr"]
                });

            var bodyCb = cb.addChild({
                cls: ["fit-cntr-body"],
                oid: "bodyElement",
            });

            if (me.config.padding !== 0) {
                cb.setStyle({ "padding": me.config.padding });
            }

            me.items.forEach(function (itm: Blend.material.Material) {
                itm.addCssClass("fit-cntr-item");
                bodyCb.addChild(me.getChildElement(itm));
            });

            return Blend.createElement(cb, me.assignElementByOID);

        }

        public add(item: MaterialType | Array<MaterialType>): Container {
            // make sure we only can include a single component
            var me = this;
            if (me.items.length === 0) {
                return super.add(item);
            } else {
                throw new Error("A Fit container can contain only one child item!");
            }
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