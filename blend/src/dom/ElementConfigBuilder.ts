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

/// <reference path="../Typings.ts" />

namespace Blend.dom {

    export class ElementConfigBuilder {

        protected config: CreateElementInterface;

        public constructor(config: string | CreateElementInterface) {
            var me = this, cfg: CreateElementInterface = {};
            if (Blend.isString(config)) {
                cfg = {
                    tag: <string>config
                };
            } else {
                cfg = <CreateElementInterface>config;
            }
            me.config = Blend.apply(
                {
                    tag: "div",
                    cls: [],
                    children: [],
                    listeners: {},
                    data: {},
                    style: {},
                    selectable: null
                },
                cfg,
                true,
                true);
        }

        public addChild(child: string | Blend.dom.ElementConfigBuilder | CreateElementInterface | Blend.dom.Element): Blend.dom.ElementConfigBuilder {
            var me = this;
            if (Blend.isInstanceOf(child, Blend.dom.ElementConfigBuilder) || Blend.isInstanceOf(child, Blend.dom.Element)) {
                me.config.children.push(child);
                return <Blend.dom.ElementConfigBuilder>child;
            } else {
                var c = new Blend.dom.ElementConfigBuilder(<CreateElementInterface>child);
                me.config.children.push(c);
                return c;
            }
        }

        public setStyle(styles: StyleInterface): Blend.dom.ElementConfigBuilder {
            var me = this;
            Blend.forEach(styles, function (v: any, k: string) {
                me.config.style[k] = v;
            });
            return this;
        }

        public setSelectable(state: boolean): Blend.dom.ElementConfigBuilder {
            this.config.selectable = state;
            return this;
        }


        public setText(text: string): Blend.dom.ElementConfigBuilder {
            this.config.text = text;
            return this;
        }

        public addCSS(css: Array<string>): Blend.dom.ElementConfigBuilder {
            var me = this;
            css.forEach(function (itm: string) {
                (<Array<string>>me.config.cls).push(itm);
            });
            return this;
        }

        public setOID(oid: string): Blend.dom.ElementConfigBuilder {
            this.config.oid = oid;
            return this;
        }

        public setTag(tag: string): Blend.dom.ElementConfigBuilder {
            this.config.tag = tag;
            return this;
        }

        public getConfig() {
            return this.config;
        }
    }
}