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
/// <reference path="../Component.ts" />

namespace Blend.mvc {

    /**
     * Abstract class providing controller regsiteration and event publishing
     * This class is the base class for View and the Context
     */
    export class Client extends Blend.Component {

        protected controllers: Array<Blend.mvc.Controller>;

        public constructor(config: MvcClientInterface = {}) {
            super(config);
            var me = this;
            me.controllers = [];
            me.addController(config.controller || []);
        }

        /**
         * Fires an event towards the Controllers within this View
         */
        protected fireEventWithScope(scope: any, eventName: string, args: Array<any>) {
            var me = this;
            if (me.controllers) {
                Blend.forEach(me.controllers, function(controller: Controller) {
                    if (controller.delegate) {
                        controller.delegate(eventName, scope, args);
                    } else {
                        //function controller
                        (<any>controller).apply(scope, [scope, eventName].concat(args));
                    }
                });
            }
        }

        /**
         * Adds (registers) Controllers with this client
         */
        public addController(controllers: ControllerType | Array<ControllerType>) {
            var me = this,
                ctrl: Controller;
            Blend.forEach(Blend.wrapInArray(controllers), function(item: ControllerType) {
                if (Blend.isClass(item) || Blend.isString(item)) {
                    ctrl = <Controller>Blend.createComponent(item);
                } else if (Blend.isObject(item)) {
                    ctrl = <Controller>item;
                } else if (Blend.isFunction(item)) {
                    ctrl = <any>item;
                }
                if (Blend.isInstanceOf(ctrl, Blend.mvc.Controller)) {
                    ctrl.bindView(me);
                    me.controllers.push(ctrl);
                } else if (Blend.isFunction(ctrl)) {
                    me.controllers.push(<any>function() { return (<any>ctrl).apply(me, arguments); });
                } else {
                    throw new Error(`${ctrl} is not a valid Blend.mvc.Controller`);
                }
            });
        }
    }
}