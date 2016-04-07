namespace Blend {

    /**
     * Base class for a component in Blend
     */
    export class Component {

        public static isComponent: boolean = true;
        protected config: any;


        constructor(config: any) {
            var me = this;
            me.config = config || {};
        }
    }
}