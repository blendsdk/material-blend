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
    children?: Array<CreateElementInterface | HTMLElement>
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

/**
 * Custom type describing a ctype
 */
type ComponentTypes = ComponentClass | ComponentConfig | string;

interface ControllerInterface {
}

interface MvcViewInterface {
    reference?: string
    controller?: Blend.mvc.Controller | Array<Blend.mvc.Controller>
    parent?: Blend.mvc.View
    [name: string]: any
}