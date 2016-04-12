/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Component.ts" />

namespace Blend.mvc {

    /**
     * Provides a generic and bindable Model
     */
    export class Model extends Blend.Component {

        public constructor(config: DictionaryInterface = {}) {
            super(config);
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
        public getData() : DictionaryInterface {
            return this.config;
        }

        private createProperties() {
            var me = this,
                sname: string, gname: string;
            Blend.forEach(me.config, function(value: any, name: string) {
                gname = 'get' + name.ucfirst(),
                    sname = 'set' + name.ucfirst();
                if (!me.hasFunction(gname)) {
                    (<any>me)[gname] = function() {
                        return me.config[name];
                    }
                }
                if (!me.hasFunction(sname)) {
                    (<any>me)[sname] = function(data: any) {
                        me.config[name] = data;
                        return me;
                    }
                }

            });
        }

    }

}