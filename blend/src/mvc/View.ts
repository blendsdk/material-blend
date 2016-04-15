/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="Client.ts" />

namespace Blend.mvc {

    export class View extends Blend.mvc.Client {

        private reference: string;
        private context: Blend.mvc.Context;
        protected eventsEnabled: boolean;

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
        public disableEvents() {
            this.eventsEnabled = false;
        }

        /**
         * Enables the event and notification on this view
         */
        public enableEvents() {
            this.eventsEnabled = true;
        }

        /**
         * Gets the reference identifier for this View
         */
        public getReference() {
            return this.reference || null;
        }

        protected canFireEvents() {
            return true;
        }

        /**
         * Fires an event towards the Controllers within this View
         * and the current global Context is possible
         */
        public fireEvent(eventName: string, ...args: any[]) {
            var me = this;
            if (me.eventsEnabled === true && me.canFireEvents() === true) {
                this.fireEventWithScope(me, eventName, args);
                if (me.context !== null) {
                    me.context.delegate(eventName, me, args);
                }
            }
        }
    }
}