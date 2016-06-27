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


interface BoxContainerInterface extends FitContainerInterface {
    reverse?: boolean;
    wrap?: Blend.eBoxWrap;
    pack?: Blend.eBoxPack;
    align?: Blend.eBoxAlign;
}

namespace Blend.container {

    export abstract class Box extends Blend.container.Container {

        protected config: BoxContainerInterface;
        protected stretchProperty: string;

        constructor(config: BoxContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = "box-cntr";
            Blend.apply(me.config, {
                reverse: config.reverse || false,
                wrap: Blend.isNullOrUndef(config.wrap) ? Blend.eBoxWrap.no : config.wrap,
                pack: Blend.isNullOrUndef(config.pack) ? Blend.eBoxPack.start : config.pack,
                align: Blend.isNullOrUndef(config.align) ? Blend.eBoxAlign.start : config.align
            }, true, true);
        }

        protected updateLayout() {
            var me = this;
            me.bodyElement.clearCssClass();
            me.bodyElement.addCssClass(me.getBodyCssClass(), true);
        }


        protected getBoxWrap() {
            var me = this;
            return `box-wrap-${Blend.parseEnum(Blend.eBoxWrap, me.config.wrap)}`;
        }

        protected getBoxPack() {
            var me = this;
            return `box-pack-${Blend.parseEnum<string>(Blend.eBoxPack, me.config.pack).toLowerCase()}`;
        }

        protected getBoxAlign() {
            var me = this;
            return `box-align-${Blend.parseEnum<string>(Blend.eBoxAlign, me.config.align)}`;
        }

        protected getBodyCssClass() {
            var me = this;
            if (me.isRendered) {
                return `box-cntr-body ${me.bodyCssClass}${me.config.reverse ? "-reverse" : ""} ${me.getBoxWrap()} ${me.getBoxPack()} ${me.getBoxAlign()}`;
            } else {
                return "box-cntr-body";
            }
        }

        protected renderBodyElement(): Blend.dom.Element | Blend.dom.ElementConfigBuilder {
            var me = this,
                bodyCb = <Blend.dom.ElementConfigBuilder>super.renderBodyElement();

            me.items.forEach(function (material: Blend.material.Material) {
                material.addCssClass(me.childCssClass);
                bodyCb.addChild(me.renderChildElement(material));
            });
            return bodyCb;
        }
    }

}


namespace Blend.container {

    export class HorizontalBox extends Blend.container.Box {
        constructor(config: BoxContainerInterface = {}) {
            super(config);
            var me = this;
            me.stretchProperty = "height";
            me.bodyCssClass = "box-horizontal";
        }
    }

    export class VerticalBox extends Blend.container.Box {
        constructor(config: BoxContainerInterface = {}) {
            super(config);
            var me = this;
            me.stretchProperty = "width";
            me.bodyCssClass = "box-vertical";
        }
    }

}