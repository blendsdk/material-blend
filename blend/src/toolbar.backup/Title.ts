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

interface ToolbarTitleInterface {
    title?: string;
}

namespace Blend.toolbar {

    export class Title extends Blend.material.Material {

        protected config: ToolbarTitleInterface;

        public constructor(config: ToolbarTitleInterface = {}) {
            super(Blend.apply(config, <ToolbarTitleInterface>{
                title: config.title || null
            }));
        }

        public setTitle(title: string) {
            var me = this;
            title = title || "";
            if (me.isRendered) {
                me.element.setHtml(title);
            } else {
                me.config.title = title;
            }
        }

        public getTitle(): string {
            return this.config.title;
        }

        protected finalizeRender(config: FinalizeRenderConfig = {}) {
            var me = this;
            me.addCssClass("mb-toolbar-title");
            super.finalizeRender(config);
        }

    }
}