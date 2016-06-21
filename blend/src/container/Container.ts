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

/// <reference path="../material/Material.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../Typings.ts" />


namespace Blend.container {

    /**
     * A Basic container that can host other Material UI components
     */
    export abstract class Container extends Blend.material.Material {

        protected items: Array<Blend.material.Material>;
        protected bodyElement: Blend.dom.Element;

        public constructor(config: ContainerMaterialInterface = {}) {
            super(config);
            var me = this;
            me.items = [];
            me.add(config.items || []);
        }

        public add(item: MaterialType | Array<MaterialType>): Container {
            var me = this,
                docFrag: DocumentFragment = document.createDocumentFragment();
            Blend.wrapInArray(item).forEach(function (itm: MaterialType) {
                if (Blend.isInstanceOf(itm, Blend.material.Material)) {
                    me.items.push(<Blend.material.Material>itm);
                } else {
                    me.items.push(<Blend.material.Material>Blend.createComponent(itm));
                }
                if (me.isRendered) {
                    docFrag.appendChild(me.items[me.items.length - 1].getElement().getEl());
                }
            });
            if (docFrag.childNodes.length !== 0) {
                me.bodyElement.appendFragment(docFrag);
            }
            return me;
        }
    }
}