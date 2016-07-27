
namespace Blend {

    export enum eSideNavigationState {
        opned = <any>"open",
        close = <any>"close",
        default = <any>"default"
    }
}

interface SideNavigationInterface extends MaterialInterface {
    open?: boolean;
    modalWhenOpen?: boolean;
    component?: Blend.material.Material;
}

namespace Blend.material {

    export class SideNavigation extends Blend.material.Material {

        protected config: SideNavigationInterface;
        protected component: Blend.material.Material;
        protected componentElement: Blend.dom.Element;

        private is_open: boolean;

        public constructor(config: SideNavigationInterface = {}) {
            super(config);
            var me = this,
                navCfg = me.getNavigationConfig(config.component || null);
            Blend.apply(me.config, <SideNavigationInterface>{
                width: Blend.isNullOrUndef(config.width) ? 250 : config.width,
                component: config.component || null,
                open: navCfg.open,
                modalWhenOpen: navCfg.modalWhenOpen
            }, true, true);
            me.config.height = "100%"; // force to fill the screen height
            me.component = me.config.component;
        }

        private getNavigationConfig(component: Blend.material.Material): SideNavigationConfig {
            if (component !== null) {
                return Blend.apply({
                    open: null,
                    modalWhenOpen: true
                }, component.getProperty<any>("config.navigationConfig"), true, true);
            } else {
                return {
                    open: null,
                    modalWhenOpen: true
                }
            }

        }

        protected render(): Blend.dom.Element {
            var me = this,
                el = super.render();
            me.componentElement = me.component.getElement({
                setBounds: false,
                setElevation: false,
            });
            me.componentElement.setData("fitted", true);
            el.append(me.componentElement);
            return el;
        }

        public isOpen(): boolean {
            return this.config.open;
        }

        public isModal(): boolean {
            return this.config.modalWhenOpen === true;
        }

        public open() {
            var me = this;
            this.config.open = true;
            me.parent.performLayout();
        }

        public close() {
            var me = this;
            this.config.open = false;
            me.parent.performLayout();
        }
    }
}