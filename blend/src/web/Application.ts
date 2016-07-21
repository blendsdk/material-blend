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

namespace Blend.web {

    /**
     * A basic application implementation containing a mainView
     * This class does not follow the material design specs!
     */
    export class Application extends Blend.application.Application {

        protected config: WebApplicationInterface;
        protected mainView: Blend.material.Material;

        public constructor(config: WebApplicationInterface = {}) {
            super(config);
            var me = this;
            me.config.mainView = config.mainView || null;
            me.config.fitMainView = config.fitMainView === false ? false : true;
        }

        protected createMainView(config: MaterialType): Blend.material.Material {
            var me = this;
            if (config) {

                var view = Blend.isInstanceOf(config, Blend.material.Material)
                    ? <Blend.material.Material>config
                    : <Blend.material.Material>Blend.createComponent(config);

                view.setContext(me.context);
                view.setProperty("parent", me);
                if (view.getProperty("useParentController", true) === true) {
                    view.addController(me.controllers);
                }
                if (me.config.fitMainView === true) {
                    view.addCssClass("mb-mainview-fit");
                }
                return view;
            } else {
                return null;
            }
        }

        protected postInitialize() {
            var me = this;
            me.mainView.doInitialize();
        }

        protected postUpdateLayout() {
            var me = this;
            me.mainView.setInLayoutContext(true);
            me.mainView.performLayout();
            me.mainView.setInLayoutContext(false);
        }

        protected render(): Blend.dom.Element {
            var me = this,
                el: Blend.dom.Element = super.render();
            me.mainView = me.createMainView(me.mainView || me.config.mainView);
            if (me.mainView) {
                el.append(me.mainView.getElement({
                    setBounds: me.config.fitMainView === true ? false : true,
                }));
            }
            return el;
        }

    }
}
