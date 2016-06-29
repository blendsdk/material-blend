/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Blend.button {

    /**
     * Base class for implementing a Button
     */
    export class Button extends Blend.material.Material {

        protected config: ButtonInterface;
        protected wrapperElement: Blend.dom.Element = null;
        protected textElement: Blend.dom.Element = null;
        protected iconElement: Blend.dom.Element = null;
        protected rippleEffect: Blend.material.effect.Ripple;

        public constructor(config: ButtonInterface = {}) {
            super(config);
            var me = this;

            me.config = Blend.apply(me.config, <ButtonInterface>{
                text: config.text || "",
                icon: config.icon || null,
                iconFamily: config.iconFamily || "material-icons",
                iconAlign: me.getCheckIconAlign(config.iconAlign),
                buttonType: config.buttonType || Blend.eButtonType.flat,
                fabPosition: config.fabPosition || Blend.eFABButtonPosition.relative,
                theme: config.theme || "default",
                disabled: config.disabled === true ? true : false,
                iconSize: config.iconSize || null,
                ripple: config.ripple === false ? false : true,
                hoverFeedback: config.hoverFeedback === false ? false : true,
                activeFeedback: config.activeFeedback === false ? false : true
            }, true, true);
        }

        public setState(value: boolean): Blend.button.Button {
            var me = this;
            me.config.disabled = !value;
            if (value === true) {
                me.element.removeAttribute("disabled");
            } else {
                me.element.setAttribute("disabled", true);
            }
            return me;
        }

        public isEnabled(): boolean {
            return !this.config.disabled;
        }

        private getCheckIconAlign(iconAlign: string): string {
            iconAlign = iconAlign || "left";
            return iconAlign.inArray(["left", "right"]) ? iconAlign : "left";
        }

        public setTheme(theme: string): Blend.button.Button {
            var me = this;
            me.config.theme = theme || "default";
            me.performLayout();
            return me;
        }

        public setButtonType(buttonType: Blend.eButtonType): Blend.button.Button {
            var me = this;
            me.config.buttonType = buttonType;
            me.element.clearCssClass().addCssClass(["mb-btn"]);
            me.performLayout();
            return me;
        }

        public setText(text: string): Blend.button.Button {
            var me = this;
            me.config.text = text;
            me.textElement.setHtml(text);
            me.performLayout();
            return this;
        }

        public setIconSize(iconSize: Blend.eButtonIconSize): Blend.button.Button {
            var me = this,
                sizeCss = "mb-btn-icon-size";
            me.config.iconSize = iconSize;
            me.element.removeCssClassLike([sizeCss]);
            if (iconSize !== null) {
                me.element.addCssClass([`${sizeCss}-` + me.config.iconSize]);
                me.performLayout();
            }
            return this;

        }

        public setIcon(icon: string): Blend.button.Button {
            var me = this;
            me.config.icon = icon;
            me.iconElement.setHtml(icon);
            me.performLayout();
            return this;
        }

        public setFabPosition(fabPosition: Blend.eFABButtonPosition): Blend.button.Button {
            var me = this,
                posCss = `mb-${me.config.buttonType}-pos`;
            if (me.isFab()) {
                me.config.fabPosition = fabPosition;
                me.element.removeCssClassLike([posCss]);
                me.element.addCssClass([`${posCss}-` + me.config.fabPosition]);
                me.performLayout();
            }
            return this;
        }

        protected updateLayout() {
            var me = this,
                rootName: string = `mb-btn-${me.config.buttonType}`,
                themeCls: string = `btn-theme-${me.config.buttonType}-${me.config.theme}`,
                bothCls: string = `${rootName}-both`,
                hoverFeeback = me.config.hoverFeedback ? `${themeCls}-hover-feedback` : "",
                activeFeeback = me.config.activeFeedback ? `${themeCls}-active-feedback` : "",
                textOnlyCls: string = `${rootName}-text-only`,
                iconOnlyCls: string = `${rootName}-icon-only`,
                textIconCls: string = "mb-btn-inner-texticon",
                iconTextCls: string = "mb-btn-inner-icontext",
                hasIcon: boolean = me.config.icon !== null,
                hasText: boolean = (me.config.text || "").trim() !== "",
                roundOrFabButton: boolean =
                    me.config.buttonType.toString().indexOf("round") !== -1
                    || me.config.buttonType.toString().indexOf("fab") !== -1;

            me.element.removeCssClass([textOnlyCls, iconOnlyCls, bothCls, themeCls, hoverFeeback, activeFeeback]);
            me.wrapperElement.removeCssClass([textIconCls, iconTextCls]);

            if (me.isFab() || me.isRound()) {
                hasText = false;
                if (!hasIcon) {
                    hasIcon = true;
                    me.setIcon("mood");
                }
                if (me.config.fabPosition && me.isFab()) {
                    me.setFabPosition(me.config.fabPosition);
                }
                if (me.isRound()) {
                    me.setIconSize(me.config.iconSize);
                }
            } else {
                me.setIconSize(me.config.iconSize);
            }

            if (hasText && hasIcon) {
                me.element.addCssClass([bothCls]);
                if (me.config.iconAlign === "left") {
                    me.wrapperElement.addCssClass(iconTextCls);
                } else if (me.config.iconAlign === "right") {
                    me.wrapperElement.addCssClass(textIconCls);
                }
            } else if (hasText) {
                me.element.addCssClass([textOnlyCls]);
            } else if (hasIcon) {
                me.element.addCssClass([iconOnlyCls]);
            }

            me.element.addCssClass([themeCls, hoverFeeback, activeFeeback]);
            me.setState(!me.config.disabled);

            if (me.config.ripple === true) {
                me.rippleEffect = null; // remove the old one!
                me.rippleEffect = new Blend.material.effect.Ripple(<RippleInterface>{
                    element: me.element,
                    center: roundOrFabButton ? true : false,
                    color: roundOrFabButton ? me.iconElement : me.textElement
                });
            }
        }

        protected notifyClick(evt: Event) {
            var me = this;
            me.fireEvent("click", evt);
        }

        protected initEvents() {
            var me = this;
            me.element.addEventListener("click", me.notifyClick.bind(me));
        }

        /**
         * Check if this button is a Floating Action Button
         */
        protected isFab(): boolean {
            return this.config.buttonType.toString().indexOf("fab") !== -1;
        }

        /**
         * Check if this button is either a round-flat or round-raised
         */
        protected isRound(): boolean {
            return this.config.buttonType.toString().indexOf("round") !== -1;
        }

        protected render(): Blend.dom.Element {
            var me = this;

            var buttonEl = new Blend.dom.ElementConfigBuilder("button")
                .addCSS(["mb-btn"]);

            var innerEl = new Blend.dom.ElementConfigBuilder("span")
                .setOID("wrapperElement")
                .addCSS(["mb-btn-inner"]);

            var txtEl = new Blend.dom.ElementConfigBuilder("span")
                .setOID("textElement")
                .addCSS(["mb-btn-text"])
                .setText(me.config.text);

            var iconEl = new Blend.dom.ElementConfigBuilder("i")
                .setOID("iconElement")
                .addCSS(["mb-btn-icon", me.config.iconFamily]);

            if (me.config.icon !== null) {
                iconEl.setText(me.config.icon);
            }
            if (me.config.iconAlign === "left") {
                innerEl.addChild(iconEl);
                innerEl.addChild(txtEl);
            }

            if (me.config.iconAlign === "right") {
                innerEl.addChild(txtEl);
                innerEl.addChild(iconEl);
            }

            buttonEl.addChild(innerEl);

            return Blend.dom.Element.create(buttonEl, me.assignElementByOID, me);
        }

    }
}

Blend.registerClassWithAlias("mb.button", Blend.button.Button);