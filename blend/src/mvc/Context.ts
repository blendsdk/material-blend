/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
