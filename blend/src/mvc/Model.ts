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

namespace Blend.mvc {

    /**
     * Provides a generic and bindable Model
     */
    export class Model extends Blend.Component {

        protected data: DictionaryInterface;

        public constructor(config: DictionaryInterface = {}) {
            super(config);
            this.data = config;
            this.createProperties();
        }

        /**
        * Sets the values of the fields in this Model. This action triggers
        * all the handlers for bound View setters
        */
        public setData(data: DictionaryInterface) {
            var me = this,
                sname: string;
            Blend.forEach(data, function(value: string, name: any) {
                sname = "set" + name.ucfirst();
                if (me.hasFunction(sname)) {
                    me.applyFunction(sname, [value]);
                }
            });
        }

        /**
         * Gets the current data in this Model
         */
        public getData(): DictionaryInterface {
            return this.data;
        }

        /**
         * Creates automatic properties for this Model when there are no
         * custom getters/setters available
         */
        private createProperties() {
            var me = this,
                sname: string, gname: string;
            Blend.forEach(me.data, function(value: any, name: string) {
                gname = "get" + name.ucfirst(),
                    sname = "set" + name.ucfirst();
                if (!me.hasFunction(gname)) {
                    (<any>me)[gname] = function() {
                        return me.data[name];
                    };
                }
                if (!me.hasFunction(sname)) {
                    (<any>me)[sname] = function(data: any) {
                        me.data[name] = data;
                        return me;
                    };
                }

            });
        }

    }

}