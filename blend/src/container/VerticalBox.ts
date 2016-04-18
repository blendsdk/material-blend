/// <reference path="../common/Interfaces.ts" />
/// <reference path="../ui/BoxContainerView.ts" />

namespace Blend.container {
    export class VerticalBox extends Blend.ui.BoxContainerView {

    }
}

namespace Blend {
    registerClassWithAlias('layout.vbox', Blend.container.VerticalBox);
}
