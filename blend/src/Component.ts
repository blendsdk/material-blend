namespace Blend {

    /**
     * Base class for a component in Blend
     */
    export class Component {

        protected config: any;

        constructor(config: any) {
            var me = this;
            me.config = config || {};
        }
    }
}