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

namespace Blend.toolbar {

    export class Toolbar extends Blend.container.HorizontalBox {

        protected config: ToolbarInterface;

        public constructor(config: ToolbarInterface = {}) {
            super(Blend.apply(config, <BoxContainerInterface>{
                theme: config.theme || "default",
                align: Blend.eBoxAlign.center,
                pack: Blend.eBoxPack.start,
                type: config.type || Blend.eToolbarType.flat,
                defaults: Blend.apply(config.defaults || {}, <ButtonInterface>{
                    hoverFeedback: false,
                    activeFeedback: false
                }, true, true)
            }));
            var me = this;
            me.themePrefix = "mb-toolbar";
        }

        protected finalizeRender(config: FinalizeRenderConfig = {}) {
            var me = this;
            me.addCssClass("mb-toolbar-" + me.config.type);
            super.finalizeRender(config);
        }
    }
}

Blend.registerClassWithAlias("mb.toolbar", Blend.toolbar.Toolbar);