
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

namespace Blend.toolbar {

    export class ToolbarGroupCollection implements CollectionProviderInterface<Blend.material.Material> {

        protected collection: Blend.Collection<Blend.material.Material>;

        clearItems: () => void;
        countItems: () => number;
        indexOf: (item: Blend.material.Material) => number;
        getItems: () => Array<Blend.material.Material>;
        itemAtIndex: (index: number) => Blend.material.Material;
        add: (item: Blend.material.Material | Array<Blend.material.Material>) => void;
        remove: (item: Blend.material.Material | number) => void;
        insertAt: (index: number, item: Blend.material.Material) => void;
        forEach: (callback: (item: Blend.material.Material, index?: number) => void) => void;

        public constructor() {
            var me = this;
            me.collection = new Blend.Collection([], me);
        }

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
