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

    export class ApplicationBar extends Blend.toolbar.Toolbar {

        public constructor(config: ApplicationBarInterface = {}) {
            super(Blend.apply(config, <BoxContainerInterface>{
                align: Blend.eBoxAlign.center,
                pack: Blend.eBoxPack.start,
                type: Blend.eToolbarType.appbar,
                theme: "appbar",
                responsive: true,
                defaults: Blend.apply(config.defaults || {}, <ButtonInterface>{
                    hoverFeedback: false,
                    activeFeedback: false
                }, true, true)
            }));
            var me = this;
        }

        protected updateLayout() {
            var me = this,
                deviceSize: Blend.eDeviceSize = Blend.Runtime.getDeviceSize(),
                or: Blend.eDeviceOrientation = Blend.Runtime.getOrientation(),
                height: string;

            /*
              Mobile Landscape: 48dp
              Mobile Portrait: 56dp
              Tablet/Desktop: 64dp
            */

            if (deviceSize === Blend.eDeviceSize.large) {
                height = "large"; // desktop, tablet lanscape
            } else if (deviceSize === Blend.eDeviceSize.medium) {
                if (or === Blend.eDeviceOrientation.landscape) {
                    height = "small"; // mobile landscape
                } else {
                    height = "large"; // tablet portait
                }
            } else if (deviceSize === Blend.eDeviceSize.small) {
                height = "medium"; // mobile portait
            }

            me.element.removeCssClassLike("mb-toolbar-height");
            me.element.addCssClass("mb-toolbar-height-" + height);

            super.updateLayout();
        }

        protected finalizeRender(config: FinalizeRenderConfig = {}) {
            var me = this;
            me.addCssClass("mb-appbar");
            super.finalizeRender(config);
        }

    }

}

Blend.registerClassWithAlias("mb.appbar", Blend.toolbar.ApplicationBar);