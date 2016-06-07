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

namespace Blend.binding {

    /**
     * Provides signal/slot style object binding.
     * The mapping can be one of the following styles
     */
    export class BindingProvider {

        /**
         * Binds the propertys of two components using setSource/getSource/setTarget method
         */
        public bindProperty(source: BindableInterface, target: BindableInterface, srcProp: string, trgProp: string = null) {
            trgProp = trgProp || srcProp;
            this.bind(source, target, "set" + srcProp.ucfirst(), "set" + trgProp.ucfirst(), "get" + srcProp.ucfirst());
        }

        public bind(
            source: BindableInterface,
            target: BindableInterface,
            sourceMember: string,
            targetMember: string,
            usingMember: string) {
            var orgSourceMember = (<any>source)[sourceMember];
            (<any>source)[sourceMember] = function() {
                var sr = orgSourceMember.apply(source, arguments);
                target.applyFunction(targetMember
                    , [usingMember !== null ? source.applyFunction(usingMember, [sr]) : sr]);
                return sr;
            };
        }
    }

}