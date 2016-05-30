/// <reference path="../Typings.ts" />
/// <reference path="../Component.ts" />

namespace Blend.mvc {

    /**
     * Provides a generic and bindable Model
     */
    export class Model extends Blend.Component {

        protected data: DictionaryInterface

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
                sname = 'set' + name.ucfirst();
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
                gname = 'get' + name.ucfirst(),
                    sname = 'set' + name.ucfirst();
                if (!me.hasFunction(gname)) {
                    (<any>me)[gname] = function() {
                        return me.data[name];
                    }
                }
                if (!me.hasFunction(sname)) {
                    (<any>me)[sname] = function(data: any) {
                        me.data[name] = data;
                        return me;
                    }
                }

            });
        }

    }

}