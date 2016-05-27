/// <reference path="../../common/Interfaces.ts" />
/// <reference path="../../Blend.ts" />
/// <reference path="../../Component.ts" />
/// <reference path="../../dom/Element.ts" />

interface RippleInterface extends DictionaryInterface {
    element?: Blend.dom.Element
}

namespace Blend.material.effect {

    export class Ripple extends Component {

        private config: RippleInterface;

        public constructor(config: RippleInterface = {}) {
            super(config);
            var me = this;
            me.config = {
                element: config.element || null
            }
            if (me.config.element !== null) {
                me.initialize();
            } else {
                throw new Error('Invalid or missing DOM element!');
            }
        }

        private initialize() {

        }

    }

}
