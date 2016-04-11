/// <reference path="../common/Interfaces.ts" />
/// <reference path="Model.ts" />

namespace Blend.mvc {
    /**
     * Profiles a global MVC context to register and use Models and Controllers
     */
    export class Context {

        private models: DictionaryInterface

        constructor() {
            var me = this;
            me.models = {};
        }

        /**
         * Gets a Model from the MVC context
         */
        public getModel(name: string) {
            var me = this;
            return me.models[name] || null;
        }

        /**
         * Add a Model to the current MVC context
         */
        public addModel(name:string, model:Blend.mvc.Model) {
            var me = this;
            if (!me.models[name]) {
                me.models[name] = model;
            } else {
                throw new Error(`A model with thaname ${name} is already registered!`);
            }
        }

    }
}

namespace Blend {
    export var mvcContext = new Blend.mvc.Context();
}