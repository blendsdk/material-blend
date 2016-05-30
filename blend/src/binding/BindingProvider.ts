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
            this.bind(source, target, 'set' + srcProp.ucfirst(), 'set' + trgProp.ucfirst(), 'get' + srcProp.ucfirst());
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
            }
        }
    }

}