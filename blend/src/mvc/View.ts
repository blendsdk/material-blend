/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="Client.ts" />

namespace Blend.mvc {

    export class View extends Blend.mvc.Client {

        private reference: string;
        private context: Blend.mvc.Context;
        private eventsEnabled: boolean;

        public constructor(config: MvcViewInterface = {}) {
            super(config);
            var me = this;
            me.context = config.context || null;
            me.reference = config.reference || null;
            me.eventsEnabled = true;
        }

        /**
         * Disables the event and notification on this View
         */
        protected dispableEvents() {
            this.eventsEnabled = false;
        }

        /**
         * Enables the event and notification on this view
         */
        protected enableEvents() {
            this.eventsEnabled = true;
        }

        /**
         * Gets the reference identifier for this View
         */
        public getReference() {
            return this.reference || null;
        }

        /**
         * Fires an event towards the Controllers within this View
         * and the current global Context is possible
         */
        protected fireEvent(eventName: string, ...args: any[]) {
            var me = this;
            if (me.eventsEnabled === true) {
                this.fireEventWithScope(me, eventName, args);
                if (me.context !== null) {
                    me.context.delegate(eventName, me, args);
                }
            }
        }
    }
}