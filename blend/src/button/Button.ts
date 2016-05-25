/// <reference path="../material/Material.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../dom/ElementConfigBuilder.ts" />

var buttonIndex = 1;

interface ButtonBaseInterface extends MaterialInterface {
    icon?: string;
    iconFamily?: string;
    theme?: string;
}

interface ButtonInterface extends ButtonBaseInterface {
    text?: string;
    iconAlign?: string;
    buttonType?: string;
}

namespace Blend.button {

    /**
     * Base class for implementing a Button
     */
    export class Button extends Blend.material.Material {

        protected config: ButtonInterface;
        protected wrapperElement: Blend.dom.Element = null;
        protected textElement: Blend.dom.Element = null;
        protected iconElement: Blend.dom.Element = null;

        public constructor(config: ButtonInterface = {}) {
            super(config);
            var me = this,
                iconAlign = config.iconAlign || 'left',
                buttonType = config.buttonType || 'flat';

            me.config = {
                text: config.text || '',
                icon: config.icon || null,
                iconFamily: config.iconFamily || 'material-icons',
                iconAlign: iconAlign.inArray(['left', 'right']) ? iconAlign : 'left',
                buttonType: buttonType.inArray(['flat', 'raised']) ? buttonType : 'flat',
                theme: config.theme || 'default'
            }
        }

        public setText(text: string) : Blend.button.Button {
            var me = this;
            me.config.text = text;
            me.textElement.setHtml(text);
            me.updateLayout();
            return this;
        }

        public setIcon(icon: string) : Blend.button.Button {
            var me = this;
            me.config.icon = icon;
            me.iconElement.setHtml(icon);
            me.updateLayout();
            return this;
        }

        protected updateLayout() {
            var me = this,
                bothCls: string = `mb-btn-${me.config.buttonType}-both`,
                textOnlyCls: string = `mb-btn-${me.config.buttonType}-text-only`,
                iconOnlyCls: string = `mb-btn-${me.config.buttonType}-icon-only`,
                textIconCls: string = 'mb-btn-inner-texticon',
                iconTextCls: string = 'mb-btn-inner-icontext',
                hasIcon: boolean = me.config.icon !== null,
                hasText: boolean = (me.config.text || '').trim() !== '';

            me.element.removeCssClass([textOnlyCls, iconOnlyCls, bothCls]);
            me.wrapperElement.removeCssClass([textIconCls, iconTextCls]);

            if (hasText && hasIcon) {
                me.element.addCssClass([bothCls]);
                if (me.config.iconAlign === 'left') {
                    me.wrapperElement.addCssClass(iconTextCls);
                } else if (me.config.iconAlign === 'right') {
                    me.wrapperElement.addCssClass(textIconCls);
                }
            } else if (hasText) {
                me.element.addCssClass([textOnlyCls]);
            } else if (hasIcon) {
                me.element.addCssClass([iconOnlyCls]);
            }
        }

        protected render(): Blend.dom.Element {
            var me = this;

            var buttonEl = new Blend.dom.ElementConfigBuilder('button')
                .addCSS(['mb-btn', `btn-theme-${me.config.buttonType}-${me.config.theme}`]);

            var innerEl = new Blend.dom.ElementConfigBuilder('span')
                .setOID('wrapperElement')
                .addCSS(['mb-btn-inner']);

            var txtEl = new Blend.dom.ElementConfigBuilder('span')
                .setOID('textElement')
                .addCSS(['mb-btn-text'])
                .setText(me.config.text);

            var iconEl = new Blend.dom.ElementConfigBuilder('i')
                .setOID('iconElement')
                .addCSS(['mb-btn-icon', me.config.iconFamily])

            if (me.config.icon !== null) {
                iconEl.setText(me.config.icon);
            }
            if (me.config.iconAlign === 'left') {
                innerEl.addChild(iconEl);
                innerEl.addChild(txtEl);
            }

            if (me.config.iconAlign === 'right') {
                innerEl.addChild(txtEl);
                innerEl.addChild(iconEl);
            }

            buttonEl.addChild(innerEl);

            return Blend.dom.Element.create(buttonEl, me.assignElementByOID, me);
        }

    }
}
