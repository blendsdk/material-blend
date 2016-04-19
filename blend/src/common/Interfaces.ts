/**
 * Interface to describ a dictioany
 */
interface DictionaryInterface {
    [name: string]: any
}

/**
 * Interface to describe a StyleInterface
 */
interface StyleInterface {
    [name: string]: string | number
}

/**
 * Interface for assigning EventListeners to DOM Elements
 */
interface CreateElementEventListenersInterface {
    [name: string]: EventListener
}

/**
 * Interface for the Dom.createElement utility
 */
interface CreateElementInterface {
    tag?: string
    scope?: any
    oid?: string
    cls?: string | Array<string>
    listeners?: CreateElementEventListenersInterface
    text?: string
    children?: Array<CreateElementInterface | HTMLElement | Blend.dom.Element>
    data?: any
    style?: StyleInterface,
    selectable?: boolean
}

/**
 *  Interface for describing a Component
 */
interface BindableInterface {
    hasFunction(fname: string): boolean;
    applyFunction(name: string, args: Array<any> | IArguments): any;
}

/**
 * Interface for describing a Blend.Component class
 */
interface ComponentClass {
    new (config?: any): Blend.Component
}

/**
 * Class registery item interface
 */
interface ClassRegistryInterface {
    [name: string]: ComponentClass;
}

/**
 * Interface for describing a Component for configuration
 * with a config type ctype
 */
interface ComponentConfig {
    ctype?: ComponentTypes,
    [name: string]: any
}

/**
 * Interface for describing a function thet can be used as a controller
 */
interface FunctionAsController {
    (client: Blend.mvc.Client, eventName: string, ...args: any[]): void
}
/**
 * Custom type describing a ctype
 */
type ComponentTypes = ComponentClass | ComponentConfig | string;
type ControllerType = ComponentClass | Blend.mvc.Controller | FunctionAsController | string;

/**
 * Interface for describing a MVC Client (Used by View and Context)
 */
interface MvcClientInterface {
    controller?: ControllerType | Array<ControllerType>
    context?: Blend.mvc.Context
}

/**
 * Interface for describing a MVC View
 */
interface MvcViewInterface extends MvcClientInterface {
    reference?: string
    [name: string]: any
}

/**
 * Interface for defining View bounds and visibility
 */
interface ElementBoundsInterface {
    top?: number
    left?: number
    width?: number | string
    height?: number | string
    visible?: boolean
}

/**
 * Interface for implementing a UI View
 */
interface UIViewInterface extends MvcViewInterface {
    parent?: Blend.ui.ViewBase
    useParentController?: boolean
    css?: string | Array<string>
    style?: StyleInterface
    visible?: boolean
    top?: number
    left?: number
    width?: number | string
    height?: number | string
    /**
     * Applies only to Box container
     */
    flex?: number;
    /**
     * Applies only yo Box container
     */
    margins?: number;
}

/**
 * UI Types definition
 */
type UIType = string | ComponentClass | UIViewInterface | UIContainerViewInterface | Blend.ui.View;

/**
 * Interface for describing a UI Container
 */
interface UIContainerViewInterface extends UIViewInterface {
    items?: UIType | Array<UIType>
}

/**
 * Interface for describing an Application
 */
interface ApplicationInterface extends UIViewInterface {
    mainView?: UIType
    theme?: string;
}

/**
 * Interface for describing padding
 */
interface UIPaddingInterface {
    top?: number | string
    right?: number | string
    bottom?: number | string
    left?: number | string
}

/**
 * Interface for descrining a paddable container
 */
interface PaddableContainerInterface extends UIContainerViewInterface {
    contentPadding?: number | UIPaddingInterface
}

/**
 * Interface for describing a Fit container
 */
interface FitContainerInterface extends PaddableContainerInterface {

}

/**
 * Interface for describing a Stack container
 */
interface StackContainerInterface extends PaddableContainerInterface {
    activeView?: number | string | Blend.ui.View;
}

/**
 * Possible values for the type of the Box container
 */
enum eBoxType {
    hbox,
    vbox
}

/**
 * Possible values for the Pack property of a Boxed layout
 */
enum eBoxLayoutPack {
    start,
    center,
    end
}

/**
 * Possible values for the Align property of a Boxed layout
 */
enum eBoxLayoutAlign {
    start,
    stretch,
    center,
    end
}

/**
 * Possible values for the Direct property of a Boxed layout
 */
enum eBoxLayoutDirection {
    LeftToRight,
    RightToLeft,
    TopToBottom,
    BottomToTop
}

/**
 * Interface for describing a Box Layout Context
 */
interface BoxLayoutContextInterface {
    pack: eBoxLayoutPack
    align: eBoxLayoutAlign
    allowScroll: boolean
    bounds: ElementBoundsInterface
    direction?: eBoxLayoutDirection
    flexPerPixel?: number
}

/**
 * Interface for describing the bounds of Box Layout Item
 */
interface BoxLayoutItemContextInterface extends ElementBoundsInterface {
    flex: boolean
    flexSize: number
}

/**
 * Interface for describing a Box Container
 */
interface BoxContainerInterface extends PaddableContainerInterface {
    boxType?: eBoxType | string
    pack?: eBoxLayoutPack
    align?: eBoxLayoutAlign
    direction?: eBoxLayoutDirection
    allowScroll?: boolean
}

enum eSplitType {
    vertical,
    horizontal
}

/**
 * Interface for describing a Splitter view
 */
interface SplitterInterface extends UIViewInterface {
    splitType?: eSplitType | string;
}