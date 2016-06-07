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

/// <reference path="Typings.ts" />
/// <reference path="Blend.ts" />
/// <reference path="binding/BindingProvider.ts" />

namespace Blend {

    /**
     * Base class for a component in Blend
     */
    export class Component implements BindableInterface {

        constructor(config: DictionaryInterface = null) {
            var me = this;
        }

        /**
         * Get the value of a perperty of this component. This is used to
         * Read the private-ish value of a component
          */
        public getProperty<T>(name: string, defaultValue: any = null): T {
            var me: any = this;
            return (me[name] === undefined ? defaultValue : me[name]);
        }

        /**
         * Provides a way to externally set a property on this component
         */
        public setProperty(name: string, value: any) {
            var me: any = this;
            me[name] = value;
        }

        /**
         * Check if this Component implements a function
         */
        public hasFunction(fname: string) {
            var me: any = this;
            return !Blend.isNullOrUndef(me[fname]) && Blend.isFunction(me[fname]);
        }

        /**
         * Dynamically run a function within this Component
         */
        public applyFunction(name: string, args: Array<any> | IArguments): any {
            var me: any = this,
                fn: Function = <Function>me[name];
            if (Blend.isFunction(fn)) {
                return fn.apply(me, args);
            } else {
                throw new Error(`Class method [${name}] does not exist!`);
            }
        }

    }
}