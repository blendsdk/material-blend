
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
            me.cssClass = "mb-flow-cntr";
            me.bodyCssClass = "mb-flow-cntr-body";
            me.childCssClass = "mb-flow-cntr-item";
        }

        protected getBodyCssClass() {
            var me = this;
            return "mb-flow-cntr-body mb-flow-cntr-body-" + me.config.direction;
        }

        public getDirection(): Blend.eFlowDirection {
            return this.config.direction;
        }

        public setDirection(direction: Blend.eFlowDirection) {
            var me = this;
            me.config.direction = direction;
            me.notifyDirectionChanged();
        }

        protected notifyDirectionChanged() {
            var me = this;
            me.fireEvent("directionChanged", me.config.direction);
            me.performLayout();
        }

        protected updateLayout() {
            var me = this;
            me.bodyElement.scrollState(me.config.scrollState);
            me.bodyElement.clearCssClass();
            me.bodyElement.addCssClass(me.getBodyCssClass());
        }
    }

}