/// <reference path="../Typings.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="Controller.ts" />
/// <reference path="Client.ts" />



namespace Blend.mvc {

    /**
     * Represents a context that hols instanses of controllers an other
     *  mvc related state
     */
    export class Context extends Blend.mvc.Client {

        /**
         * Delegates an event to the Controllers within this Context
         */
        public delegate(eventName: string, sender: Client, args: Array<any>) {
            this.fireEventWithScope(sender, eventName, args);
        }
    }

}
