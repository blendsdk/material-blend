namespace Blend.container {

    export class HorizontalSplit extends Blend.container.Split {

        public constructor(config: SplitInterface = {}) {
            super(config);
            var me = this;
            me.splitterType = Blend.eSplitterType.horizontal;
            me.sizeProperty = "height";
            me.positionProperty = "top";
        }

        protected renderChildElement(material: Blend.material.Material): Blend.dom.Element {
            var el = material.getElement();
            material.setBounds({
                width: null
            });
            return el;
        }
    }
}

Blend.registerClassWithAlias("lay.hsplit", Blend.container.HorizontalSplit);