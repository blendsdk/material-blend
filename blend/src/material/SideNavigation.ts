namespace Blend.material {

    export class SideNavigation extends Blend.material.Material {

        protected config: SideNavigationInterface;

        public constructor(config: SideNavigationInterface = {}) {
            super(config);
            var me = this;
            Blend.apply(me.config, <SideNavigationInterface>{
                navigationStyle: config.navigationStyle || Blend.eNavigationStyle.responsive
            }, true, true);
        }
    }
}