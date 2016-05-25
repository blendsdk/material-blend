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
    fabPosition?: string;
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
        protected buttonTypes: Array<string>;
        protected fabPositions: Array<string>;

        public constructor(config: ButtonInterface = {}) {
            super(config);
            var me = this;
            me.buttonTypes = ['flat', 'raised', 'fab', 'fab-mini'];
            me.fabPositions = [
                'top-right',
                'top-center',
                'top-left',
                'center-right',
                'center-center',
                'center-left',
                'bottom-right',
                'bottom-center',
                'bottom-left',
                'relative'
            ];
            me.config = {
                text: config.text || '',
                icon: config.icon || null,
                iconFamily: config.iconFamily || 'material-icons',
                iconAlign: me.getCheckIconAlign(config.iconAlign),
                buttonType: me.getCheckButtonType(config.buttonType),
                fabPosition: me.getCheckFabPosition(config.fabPosition),
                theme: config.theme || 'default'
            }
        }

        private getCheckFabPosition(fabPosition: string): string {
            var me = this;
            fabPosition = fabPosition || 'relative';
            fabPosition = fabPosition.inArray(me.fabPositions) ? fabPosition : 'relative';
            return fabPosition === 'relative' ? null : fabPosition;
        }

        private getCheckIconAlign(iconAlign: string): string {
            iconAlign = iconAlign || 'left';
            return iconAlign.inArray(['left', 'right']) ? iconAlign : 'left';
        }

        private getCheckButtonType(buttonType: string): string {
            var me = this;
            buttonType = (buttonType || 'flat');
            return buttonType.inArray(me.buttonTypes) ? buttonType : 'flat';
        }

        public setButtonType(buttonType: string) {
            var me = this;
            me.config.buttonType = me.getCheckButtonType(buttonType);
            me.element.clearCssClass().addCssClass(['mb-btn']);
            me.performLayout();
        }

        public setText(text: string): Blend.button.Button {
            var me = this;
            me.config.text = text;
            me.textElement.setHtml(text);
            me.performLayout();
            return this;
        }

        public setIcon(icon: string): Blend.button.Button {
            var me = this;
            me.config.icon = icon;
            me.iconElement.setHtml(icon);
            me.performLayout();
            return this;
        }

        public setFabPosition(fabPosition: string): Blend.button.Button {
            var me = this,
                posCss = `mb-${me.config.buttonType}-pos`;
            if (me.isFab()) {
                me.config.fabPosition = me.getCheckFabPosition(fabPosition);
                me.element.removeCssClassLike([posCss]);
                me.element.addCssClass([`${posCss}-` + me.config.fabPosition]);
                me.performLayout();
            }
            return this;
        }

        protected updateLayout() {
            var me = this,
                themeCls: string = `btn-theme-${me.config.buttonType}-${me.config.theme}`,
                bothCls: string = `mb-btn-${me.config.buttonType}-both`,
                textOnlyCls: string = `mb-btn-${me.config.buttonType}-text-only`,
                iconOnlyCls: string = `mb-btn-${me.config.buttonType}-icon-only`,
                textIconCls: string = 'mb-btn-inner-texticon',
                iconTextCls: string = 'mb-btn-inner-icontext',
                hasIcon: boolean = me.config.icon !== null,
                hasText: boolean = (me.config.text || '').trim() !== '';

            me.element.removeCssClass([textOnlyCls, iconOnlyCls, bothCls, themeCls]);
            me.wrapperElement.removeCssClass([textIconCls, iconTextCls]);

            if (me.isFab()) {
                hasText = false;
                if (!hasIcon) {
                    hasIcon = true;
                    me.setIcon('mood');
                }
                if (me.config.fabPosition) {
                    me.setFabPosition(me.config.fabPosition)
                }
            }

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

            me.element.addCssClass([themeCls]);
        }

        /**
         * Check if this button is a Floating Action Button
          */
        protected isFab(): boolean {
            return this.config.buttonType.indexOf('fab') !== -1;
        }

        protected render(): Blend.dom.Element {
            var me = this;

            var buttonEl = new Blend.dom.ElementConfigBuilder('button')
                .addCSS(['mb-btn']);

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
