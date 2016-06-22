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

interface RectangleInterface extends MaterialInterface {
    color?: string;
    border?: boolean;
}

namespace Blend.material {

    export class Rectangle extends Blend.material.Material {

        protected config: RectangleInterface;
        private layoutCount: number;

        constructor(config: RectangleInterface = {}) {
            super(config);
            var me = this;
            me.setBounds({
                width: config.width || 100,
                height: config.height || 100
            });
            me.setStyle({
                "background-color": config.color || "transparent",
                "border": config.border === true ? "1px solid #000" : null
            });
            me.layoutCount = 0;
        }

        protected layoutView() {
            var me = this;
            me.layoutCount++;
        }

        protected finalizeRender(config: FinalizeRenderConfig) {
            var me = this;
            super.finalizeRender(config);
            me.addCssClass("m-rectangle");
        }

        private log() {
            var me = this;
            me.element.setHtml(`<pre>Layouts: ${me.layoutCount}</pre>`);
        }
    }
}

Blend.registerClassWithAlias("mb.rect", Blend.material.Rectangle);