interface DictionaryInterface {
    [name: string]: any
}

/**
 * @interface StyleInterface
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

interface ClassRegistryInterface {
    [name: string]: ComponentClass;
}

/**
 * Interface for describing a Component for configuration
 *  with a config type ctype
 */
interface ComponentConfig {
    ctype?: ComponentTypes,
    [name: string]: any
}

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
}

type UIType = ComponentClass | UIViewInterface | UIContainerViewInterface | Blend.ui.ViewBase;

interface UIContainerViewInterface extends UIViewInterface {
    items?: UIType | Array<UIType>
}