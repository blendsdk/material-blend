namespace Blend.material {

    export class SideNavigation extends Blend.material.Material {

        protected config: SideNavigationInterface;

        public constructor(config: SideNavigationInterface = {}) {
            super(config);
            var me = this;
            Blend.apply(me.config, <SideNavigationInterface>{
                navigationStyle: config.navigationStyle || Blend.eNavigationStyle.responsive,
                width: Blend.isNullOrUndef(config.width) ? 250 : config.width,
            }, true, true);
            me.config.height = "100%"; // force to fill the screen height
        }
    }
}