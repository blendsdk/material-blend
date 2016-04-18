/// <reference path="../common/Interfaces.ts" />
/// <reference path="../ui/BoxContainerView.ts" />

namespace Blend.container {
    export class HorizontalBox extends Blend.ui.BoxContainerView {

    }
}

namespace Blend {
    registerClassWithAlias('layout.hbox', Blend.container.HorizontalBox);
}