/// <reference path="../Typings.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="Client.ts" />

namespace Blend.mvc {

    export class View extends Blend.mvc.Client {

        private reference: string;
        protected context: Blend.mvc.Context;
        protected eventsEnabled: boolean;
        protected currentEventName: string;

        public constructor(config: MvcViewInterface = {}) {
            super(config);
            var me = this;
            me.reference = config.reference || null;
            me.currentEventName = null;
            me.setContext(config.context || null);
            me.disableEvents();
        }

        /**
         * Sets the global MVC context
          */
        public setContext(context: Blend.mvc.Context) {
            var me = this;
            me.context = context;
        }

        /**
         * Checks to see if we have a global MVC context
         */
        public hasContext() {
            return !Blend.isNullOrUndef(this.context);
        }

        /**
         * Disables the event and notification on this View
         */
        public disableEvents(): Blend.mvc.Client {
            this.eventsEnabled = false;
            return this;
        }

        /**
         * Enables the event and notification on this view
         */
        public enableEvents(): Blend.mvc.Client {
            this.eventsEnabled = true;
            return this;
        }

        /**
         * Gets the reference identifier for this View
         */
        public getReference() {
            return this.reference || null;
        }

        public canFireEvents(): boolean {
            return this.eventsEnabled === true;
        }

        /**
         * Fires an event towards the Controllers within this View
         * and the current global Context is possible
         */
        public fireEvent(eventName: string, ...args: any[]): Blend.mvc.Client {
            var me = this;
            me.currentEventName = eventName;
            if (me.canFireEvents() === true) {
                this.fireEventWithScope(me, eventName, args);
                if (me.context !== null) {
                    me.context.delegate(eventName, me, args);
                }
            }
            return this;
        }
    }
}