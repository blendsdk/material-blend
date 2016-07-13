
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

namespace Blend.container {

    export class Flow extends Blend.container.Container {

        protected config: FlowContainerInterface;

        public constructor(config: FlowContainerInterface = {}) {
            super(config);
            var me = this;
            Blend.apply(me.config, <FlowContainerInterface>{
                scrollState: config.scrollState || Blend.eScrollState.auto,
                direction: config.direction || Blend.eFlowDirection.vertical
            }, true, true);
            me.cssClass = "flow-cntr";
            me.bodyCssClass = "flow-cntr-body";
            me.childCssClass = "flow-cntr-item";
        }

        protected getBodyCssClass() {
            var me = this;
            return "flow-cntr-body flow-cntr-body-" + me.config.direction;
        }

        protected updateLayout() {
            var me = this;
            me.bodyElement.scrollState(me.config.scrollState);
            me.bodyElement.clearCssClass();
            me.bodyElement.addCssClass(me.getBodyCssClass());
        }
    }

}