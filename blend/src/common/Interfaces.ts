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
    cls?: string|Array<string>
    listeners?: CreateElementEventListenersInterface
    text?: string
    children?: Array<CreateElementInterface|HTMLElement>
    data?: any
    style?: StyleInterface,
    selectable?:boolean
}