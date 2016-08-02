
interface ToolbarGroupInterface {
    name?: string;
    items?: Array<MaterialType>;
    defaults?: MaterialInterface;
    autoArrange?: boolean;
}

interface ToolbarInterface {
    primaryGroup: ToolbarGroupInterface | Blend.toolbar.ToolbarGroup;
    extenedGroup: ToolbarGroupInterface | Blend.toolbar.ToolbarGroup;
}


namespace Blend {



}

namespace Blend.toolbar {

    export class ToolbarGroupCollection {

    }

}

namespace Blend.toolbar {

    export class ToolbarGroup {

    }

}


namespace Blend.toolbar {

    export class Toolbar {

        protected primaryGroup: Blend.toolbar.ToolbarGroupCollection;
        protected extenedGroup: Blend.toolbar.ToolbarGroupCollection;

    }

}
