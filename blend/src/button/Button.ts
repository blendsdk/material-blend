/// <reference path="../material/Material.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../dom/ElementConfigBuilder.ts" />


interface ButtonBaseInterface extends MaterialInterface {
    icon?: string;
    iconFamily?: string;
}

interface ButtonInterface extends ButtonBaseInterface {
    text?: string;
    iconAlign?: string;
}

namespace Blend.button {

    /**
     * Base class for implementing a Button
     */
    export class Button extends Blend.material.Material {

        protected config: ButtonInterface;

        public constructor(config: ButtonInterface = {}) {
            super(config);
            var me = this;

            me.config = {
                text: config.text || null,
                icon: config.icon || null,
                iconFamily: config.iconFamily || 'material-icons',
                iconAlign: <string>((config.iconAlign || 'left').inArray(['left', 'right']) || 'left')
            }
        }

        protected render(): Blend.dom.Element {
            var cb = new Blend.dom.ElementConfigBuilder(<CreateElementInterface>{
                tag: 'button',
                type:'button'
            });
            return Blend.createElement(cb);
        }

    }
}
