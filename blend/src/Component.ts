/// <reference path="common/Interfaces.ts" />
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
         * Check if this Component implements a function
         */
        public hasFunction(fname: string) {
            var me: any = this;
            return !Blend.isNullOrUndef(me[fname]) && Blend.isFunction(me[fname]);
        }

        /**
         * Dynamically run a function within this Component
         */
        public applyFunction(name: string, args: Array<any>|IArguments): any {
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