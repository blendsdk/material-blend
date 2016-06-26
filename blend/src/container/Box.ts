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
}

namespace Blend {

}


namespace Blend.container {

    export abstract class Box extends Blend.container.Container {

        protected config: BoxContainerInterface;

        constructor(config: BoxContainerInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = "box-cntr";
        }

        protected renderBodyElement(): Blend.dom.Element | Blend.dom.ElementConfigBuilder {
            var me = this,
                bodyCb = <Blend.dom.ElementConfigBuilder>super.renderBodyElement();

            me.items.forEach(function (material: Blend.material.Material) {
                material.addCssClass(me.childCssClass);
                bodyCb.addChild(me.getChildElement(material));
            });
            return bodyCb;
        }

        protected render(): Blend.dom.Element {
            var me = this,
                cb = new Blend.dom.ElementConfigBuilder({
                    cls: ["box-cntr"]
                });

            if (me.config.padding !== 0) {
                cb.setStyle({ "padding": me.config.padding });
            }
            cb.addChild(me.renderBodyElement());
            return Blend.createElement(cb, me.assignElementByOID);
        }
    }

}


namespace Blend.container {
    export class HBoxContainer extends Blend.container.Box {

        constructor(config: BoxContainerInterface = {}) {
            super(config);
            var me = this;
            me.bodyCssClass = "box-horizontal";
        }

    }
}