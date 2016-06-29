interface ToolbarInterface extends ContainerInterface {
    type?: string;
    size?: string | number;
}

namespace Blend.toolbar {

    export class Toolbar extends Blend.container.HorizontalBox {

        protected config: ToolbarInterface;

        public constructor(config: ToolbarInterface = {}) {
            super(Blend.apply(config, <BoxContainerInterface>{
                align: Blend.eBoxAlign.center,
                pack: Blend.eBoxPack.start,
                defaults: Blend.apply(config.defaults || {}, <ButtonInterface>{
                    hoverFeedback: false,
                    activeFeedback: false
                })
            }));
            var me = this;
        }

        protected finalizeRender(config: FinalizeRenderConfig = {}) {
            var me = this;
            me.addCssClass("mb-toolbar-" + me.config.type);
            me.setBounds({
                width: me.config.size
            });
            super.finalizeRender(config);
        }
    }
}

Blend.registerClassWithAlias("mb.toolbar", Blend.toolbar.Toolbar);