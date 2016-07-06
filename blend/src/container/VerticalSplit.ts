namespace Blend.container {

    export class VerticalSplit extends Blend.container.Split {

        public constructor(config: SplitInterface = {}) {
            super(config);
            var me = this;
            me.splitterType = Blend.eSplitterType.vertical;
            me.sizeProperty = "width";
            me.positionProperty = "left";
        }

        protected renderChildElement(material: Blend.material.Material): Blend.dom.Element {
            var el = material.getElement();
            material.setBounds({
                height: null
            });
            return el;
        }

    }
}

Blend.registerClassWithAlias("lay.vsplit", Blend.container.VerticalSplit);