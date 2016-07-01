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

    /**
     * A Basic container that can host other Material UI components
     */
    export abstract class Container extends Blend.material.Material {

        protected config: ContainerInterface;
        protected items: Array<Blend.material.Material>;
        protected bodyElement: Blend.dom.Element;
        protected cssClass: string;
        protected bodyCssClass: string;
        protected childCssClass: string;

        public constructor(config: ContainerInterface = {}) {
            super(config);
            var me = this;
            me.bodyElement = null; // will ensure the OID is set correctly
            me.items = [];
            me.add(config.items || []);
            Blend.apply(me.config, <ContainerInterface>{
                padding: config.padding || 0,
                defaults: config.defaults || {}
            });
        }

        /**
         * Internal hook to be able to dynamically override the bodyCssClass
         */
        protected getBodyCssClass() {
            var me = this;
            return me.bodyCssClass;
        }

        public setPadding(value: number | string): Blend.container.Container {
            var me = this;
            if (me.isRendered) {
                me.element.setStyle({
                    padding: value
                });
            }
            me.config.padding = value;
            return this;
        }

        protected withItems(callback: Function) {
            var me = this;
            me.items.forEach(function (material: Blend.material.Material) {
                callback.apply(me, [material]);
            });
        }

        protected postInitialize() {
            var me = this;
            // Initialize the child elements
            me.withItems(function (material: Blend.material.Material) {
                material.doInitialize();
            });
        }

        protected postUpdateLayout() {
            var me = this;
            me.layoutChildren();
        }

        protected layoutChildren() {
            var me = this;
            // Perform layout on children
            me.withItems(function (material: Blend.material.Material) {
                material.performLayout();
            });
        }

        protected renderChildElement(materail: Blend.material.Material): Blend.dom.Element {
            return materail.getElement();
        }

        protected checkComponent(material: Blend.material.Material): boolean {
            return true;
        }

        protected renderBodyElement(): Blend.dom.Element | Blend.dom.ElementConfigBuilder {
            var me = this;
            return new Blend.dom.ElementConfigBuilder({
                cls: [me.getBodyCssClass()],
                oid: "bodyElement",
                children: me.renderChildren()
            });
        }

        protected renderChildren(): Array<Blend.dom.Element | Blend.dom.ElementConfigBuilder> {
            var me = this,
                list: Array<Blend.dom.Element> = [];
            me.withItems(function (material: Blend.material.Material) {
                material.addCssClass(me.childCssClass);
                list.push(me.renderChildElement(material));
            });
            return list;
        }

        protected render(): Blend.dom.Element {
            var me = this,
                cb = new Blend.dom.ElementConfigBuilder({
                    cls: [me.cssClass]
                });
            cb.addChild(me.renderBodyElement());
            return Blend.createElement(cb, me.assignElementByOID, me);
        }

        protected finalizeRender(config: FinalizeRenderConfig = {}) {
            var me = this;
            super.finalizeRender(config);
            if (me.config.padding !== 0) {
                me.element.setStyle({ "padding": me.config.padding });
            }
        }

        protected createChildComponent(itm: ComponentTypes): Blend.material.Material {
            var me = this;
            if (Blend.isInstanceOf(itm, Blend.material.Material)) {
                return <Blend.material.Material>itm;
            } else {
                return <Blend.material.Material>Blend.createComponent(itm, me.config.defaults);
            }
        }

        protected initChildComponent(component: Blend.material.Material) {
            var me = this;
            component.setContext(me.context);
            if (component.getProperty("useParentController", true) === true) {
                component.addController(me.controllers);
            }
            component.setProperty("parent", me);
        }

        protected createChildComponents(components: Array<MaterialType>): Array<Blend.material.Material> {
            var me = this,
                list: Array<Blend.material.Material> = [];
            components.forEach(function (item: MaterialType) {
                list.push(me.createChildComponent(item));
            });
            return list;
        }

        public add(item: MaterialType | Array<MaterialType>): Container {
            var me = this,
                docFrag: DocumentFragment = document.createDocumentFragment(),
                childComponents = me.createChildComponents(Blend.wrapInArray(item));
            childComponents.forEach(function (component: Blend.material.Material) {
                if (me.checkComponent(component)) {
                    me.items.push(component);
                    me.initChildComponent(component);
                    if (me.isRendered) {
                        component.addCssClass(me.childCssClass);
                        component.doInitialize();
                        docFrag.appendChild(me.renderChildElement(component).getEl());
                    }
                }
            });
            if (docFrag.childNodes.length !== 0) {
                me.bodyElement.appendFragment(docFrag);
                me.performLayout();
            }
            return me;
        }
    }
}