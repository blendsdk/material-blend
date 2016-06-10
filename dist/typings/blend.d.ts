/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


interface Array<T> {
    unique(): Array<T>;
}
interface String {
    ucfirst(): string;
    repeat(counts: number): string;
    startsWith(searchString: string, position?: number): boolean;
    inArray(list: Array<string>): boolean;
}
interface Function {
    async: any;
}
interface XMLHttpRequest {
    sendAsBinary(data: any): void;
}


/**
 * Interface for configuring a dictioany
 */
interface DictionaryInterface {
    [name: string]: any;
}
/**
 * Interface for configuring Styles
 */
interface StyleInterface {
    [name: string]: string | number;
}
/**
 * Interface for assigning EventListeners to DOM Elements
 */
interface CreateElementEventListenersInterface {
    [name: string]: EventListener;
}
/**
 * Interface for configuring the Dom.createElement utility
 */
interface CreateElementInterface {
    tag?: string;
    scope?: any;
    oid?: string;
    cls?: string | Array<string>;
    listeners?: CreateElementEventListenersInterface;
    text?: string;
    children?: Array<CreateElementInterface | HTMLElement | Blend.dom.Element>;
    data?: any;
    style?: StyleInterface;
    selectable?: boolean;
}
/**
 *  Interface for configuring a Component
 */
interface BindableInterface {
    hasFunction(fname: string): boolean;
    applyFunction(name: string, args: Array<any> | IArguments): any;
}
/**
 * Interface for configuring a Blend.Component class
 */
interface ComponentClass {
    new (config?: any): Blend.Component;
}
/**
 * Class registery item interface
 */
interface ClassRegistryInterface {
    [name: string]: ComponentClass;
}
/**
 * Interface for configuring a Component using JSON config notation
 * with a config type ctype
 */
interface ComponentConfig {
    ctype?: ComponentTypes;
    [name: string]: any;
}
/**
 * Interface for configuring a function that can be used as a controller
 */
interface FunctionAsController {
    (client: Blend.mvc.Client, eventName: string, ...args: any[]): void;
}
/**
 * Custom type describing a ctype
 */
declare type ComponentTypes = ComponentClass | ComponentConfig | string;
declare type ControllerType = ComponentClass | Blend.mvc.Controller | FunctionAsController | string;
/**
 * Interface for configuring a MVC Client (Used by Material and Context)
 */
interface MvcClientInterface {
    controller?: ControllerType | Array<ControllerType>;
    context?: Blend.mvc.Context;
}
/**
 * Interface for configuring a MVC View
 */
interface MvcViewInterface extends MvcClientInterface {
    reference?: string;
    [name: string]: any;
}
/**
 * Interface for configuring a Material's bounds and visibility
 */
interface ElementBoundsInterface {
    top?: number;
    left?: number;
    width?: number | string;
    height?: number | string;
    visible?: boolean;
}
interface MediaQueryConfig extends DictionaryInterface {
    [name: string]: string | Array<string>;
}
/**
 * Interface for configuring an Ajax (Post/Get) query
 */
interface AjaxRequestInterface {
    url: string;
    headers?: DictionaryInterface;
    onStart?: Function;
    onProgress?: Function;
    onPrepareUpload?: Function;
    onComplete?: Function;
    onSuccess?: Function;
    onFailed?: Function;
    scope?: any;
    withCredentials?: boolean;
}
/**
 * Interface for configuring the padding of an Element
 */
interface PaddingInterface {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}
/**
 * Material Types definition
 */
declare type MaterialType = string | ComponentClass | MaterialInterface | ContainerMaterialInterface | Blend.material.Material;
/**
 * Interface for configuring a Material
 */
interface MaterialInterface extends MvcViewInterface {
    parent?: Blend.material.Material;
    useParentController?: boolean;
    css?: string | Array<string>;
    style?: StyleInterface;
    visible?: boolean;
    top?: number;
    left?: number;
    width?: number | string;
    height?: number | string;
    responsive?: boolean;
    responseTo?: MediaQueryConfig;
}
/**
 * Interface for configuring a Container
 */
interface ContainerMaterialInterface extends MaterialInterface {
    items?: Array<MaterialType>;
}
/**
 * Interface for configuring an Application
 */
interface ApplicationInterface extends MaterialInterface {
    mainView?: MaterialType;
    theme?: string;
}
/**
 * Interface for configuring a Button
 */
interface ButtonInterface extends MaterialInterface {
    icon?: string;
    iconSize?: string;
    iconFamily?: string;
    theme?: string;
    disabled?: boolean;
    ripple?: boolean;
    text?: string;
    iconAlign?: string;
    buttonType?: string;
    fabPosition?: string;
}


declare namespace Blend.binding {
    /**
     * Provides signal/slot style object binding.
     * The mapping can be one of the following styles
     */
    class BindingProvider {
        /**
         * Binds the propertys of two components using setSource/getSource/setTarget method
         */
        bindProperty(source: BindableInterface, target: BindableInterface, srcProp: string, trgProp?: string): void;
        bind(source: BindableInterface, target: BindableInterface, sourceMember: string, targetMember: string, usingMember: string): void;
    }
}


declare namespace Blend {
    /**
     * Base class for a component in Blend
     */
    class Component implements BindableInterface {
        constructor(config?: DictionaryInterface);
        /**
         * Get the value of a perperty of this component. This is used to
         * Read the private-ish value of a component
          */
        getProperty<T>(name: string, defaultValue?: any): T;
        /**
         * Provides a way to externally set a property on this component
         */
        setProperty(name: string, value: any): void;
        /**
         * Check if this Component implements a function
         */
        hasFunction(fname: string): boolean;
        /**
         * Dynamically run a function within this Component
         */
        applyFunction(name: string, args: Array<any> | IArguments): any;
    }
}


declare namespace Blend.dom {
    /**
     * Implements a classList provider for the Blend.dom.Element
     */
    class ClassList {
        protected list: Array<string>;
        constructor(htmlElement: HTMLElement);
        private initList(css);
        serializeTo(htmlElement: HTMLElement): void;
        removeLike(list: Array<string>): void;
        remove(list: Array<string>): void;
        add(list: Array<string>): void;
        clear(): void;
        has(n: string): boolean;
        toString(): string;
        toArray(): Array<string>;
    }
}


declare namespace Blend.dom {
    /**
     * Implements a style list provides for the Blend.dom.Element
     */
    class StyleList {
        private styles;
        private el;
        private pixelRe;
        private UNIT;
        private unitPropertyRe;
        private unitTypeRe;
        constructor(el: HTMLElement);
        private initList(data);
        set(name: string, value: any): void;
        unset(name: string): void;
        getComputed(el: HTMLElement, names: Array<string>): StyleInterface;
        serializeTo(el: HTMLElement): void;
        /**
         * Checks and converts the value to px based on the given key
         */
        private toUnit(key, value);
        /**
         * Given the value it converts px value to a number, otherwise it returns the original
         * value.
         */
        private fromUnit(value);
    }
}


declare namespace Blend.dom {
    /**
     * Wraps an HTMLElement into a utility class for easier  manipulation
     * and hadling
     */
    class Element extends Component {
        private el;
        private pixelRe;
        private UNIT;
        private unitPropertyRe;
        private unitTypeRe;
        classList: Blend.dom.ClassList;
        styleList: Blend.dom.StyleList;
        constructor(el: HTMLElement);
        /**
         * Sets an attribute to this element
         */
        setAttribute(name: string, value?: any): Blend.dom.Element;
        /**
         * Removed an attribute from this element
         */
        removeAttribute(name: string): Blend.dom.Element;
        /**
         * Get the list of files for from this Element
          */
        getFiles(): FileList;
        /**
         * Adds an EventListener to an EventTarget
         */
        addEventListener(eventName: string, eventHandler: EventListener): void;
        /**
         * Removes an EventListener from an EventTarget
         */
        removeEventListener(eventName: string, eventHandler: EventListener): void;
        /**
         * Retuns the computed bounds
         */
        getBounds(): ElementBoundsInterface;
        /**
         * Sets the style of this element
         */
        setStyle(styles: StyleInterface): Blend.dom.Element;
        /**
         * Gets the computed styles of en element
         */
        getStyle(styles: string | Array<string>): StyleInterface;
        /**
         * Gets the CSS classes from this element if possible
         * @return string|string[]
         */
        getCssClass(asArray?: boolean): (string | Array<string>);
        /**
         * Checks whether this element has a given CSS class
         */
        hasCssClass(name: string): boolean;
        /**
         * Adds a new css class an element if it already does not exist
         * The replace flag will replace the existsing css class value
         */
        addCssClass(css: string | string[], replace?: boolean): Blend.dom.Element;
        /**
         * Removes one of more CSS classes from this element
         */
        removeCssClass(css: string | string[]): Blend.dom.Element;
        /**
         * Removes one or more CSS classes from this element by checking if the
         * CSS names start with the given request
         */
        removeCssClassLike(css: string | string[]): Blend.dom.Element;
        /**
         * Clears the value of the class attribute of this element
         */
        clearCssClass(): Blend.dom.Element;
        /**
         * Removes the child elements from this Element
         */
        clearElement(): void;
        /**
         * Sets the data-* attribute for this element
         */
        setData(name: string, value: any): Blend.dom.Element;
        /**
         * Gets a data attribute or returns a default value if the attribute does
         * not exist
         */
        getData(name: string, defaultValue?: any): any;
        /**
         * Set the Scroll state for this Element
         */
        scrollState(state: Blend.eScrollState): Blend.dom.Element;
        /**
         * Enables/Disables the text select state of this element
         */
        selectable(state: boolean): void;
        /**
         * Gets the native HTMLElement
         */
        getEl(): HTMLElement;
        /**
         * Appends a child Element to this Element
         */
        append(child: Blend.dom.Element): Blend.dom.Element;
        /**
         * Removes this element from its parent
         */
        remove(): void;
        /**
         * Sets the inner HTML of this element
         */
        setHtml(html: string): Blend.dom.Element;
        setPadding(value: number | PaddingInterface): Blend.dom.Element;
        /**
         * Gets the inner HTML of this element
         */
        getHtml(): string;
        /**
         * Created an Element based on CreateElementInterface
         */
        static create(conf: CreateElementInterface | Blend.dom.ElementConfigBuilder, elCallback?: Function, elCallbackScope?: any): Blend.dom.Element;
    }
}
declare namespace Blend {
    /**
     * Wrapper for Blend.dom.Element.create
     */
    var createElement: typeof dom.Element.create;
    /**
     * Wrapper for document.querySelector
     */
    function selectElement(query: string, from?: Blend.dom.Element): Blend.dom.Element;
    /**
     * Wrapper for document.querySelectorAll
     */
    function selectElements(query: string, from?: Blend.dom.Element): Array<Blend.dom.Element>;
    /**
     * Wrapper for document.getElementById
      */
    function getElement(el: string | HTMLElement): Blend.dom.Element;
}


declare namespace Blend {
    /**
     * Provides functionality to get Blend kickstarted and check for
     * brower compatibility
     */
    class RuntimeSingleton {
        private readyCallbacks;
        private kickStarted;
        private mediaQueryRegistery;
        private mediaQueryMatchers;
        private previousMediaQuery;
        Binder: Blend.binding.BindingProvider;
        IE: boolean;
        IEVersion: number;
        constructor();
        /**
         * Used to trigger the media query matching on application.
         */
        triggerMediaQueryCheck(): void;
        /**
         * Adds a media query listener
         */
        addMediaQueryListener(mediaQuery: string, listener: Function): void;
        /**
         * Checks if the current browser is supported
          */
        private isSupportedBrowser();
        /**
         * Resets the "ready" callback buffer
         */
        reset(): void;
        /**
         * Adds a callback function to run when the browser is ready to go
         */
        ready(callback: Function, scope?: any): Blend.RuntimeSingleton;
        /**
         * Initiates Blend's application lifecycle by executing the callbacks
         * which are registered by {Environment.ready}. This function needs to called
         * to get a Blend application started.
         */
        kickStart(): void;
        /**
         * Adds an EventListener to an EventTarget. You can add multiple events by
         * providing event names seperated by spaces (eg. 'mouseup click')
         */
        addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void;
        /**
         * Removes an EventListener from an EventTarget. You can remove multiple events by
         * providing event names seperated by spaces (eg. 'mouseup click')
         */
        removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void;
        private detectIE();
    }
    /**
     * Global reference to the RuntimeSingleton
     */
    var Runtime: RuntimeSingleton;
}


declare namespace Blend {
    class eMediaQuery {
        static LARGE: string;
        static MEDIUM: string;
        static SMALL: string;
    }
    /**
     * Element Scroll values
     */
    enum eScrollState {
        none = 0,
        auto = 1,
        both = 2,
        horizontal = 3,
        vertical = 4,
    }
    var registry: ClassRegistryInterface;
    /**
     * Put the framework in DEBUG mode
     */
    var DEBUG: boolean;
    var COMMON_MEDIA_QUERIES: DictionaryInterface;
    /**
     * Bind wraps a function into a new functions so it can run in a given scope
     * whn the new function is called.
     */
    function bind(scope: any, fn: Function): () => void;
    /**
     * Generates a new sequential ID used internally for debugging
     */
    function newID(): number;
    /**
     * Returns enum value, either the value as number or its string representation
     */
    function parseEnum<T>(objEnum: any, value: string | number, defaultValue?: any): T;
    /**
     * Checks if the given value is a function
     */
    function isFunction(value: any): boolean;
    /**
     * Checks if the given value is a string
     */
    function isString(value: any): boolean;
    /**
     * Checks if the given value is null or undefined
     */
    function isNullOrUndef(value: any): boolean;
    /**
      * Checks if the given value is an array
      */
    function isArray(value: any): boolean;
    /**
     * Checks if the given value is a number
     */
    function isNumeric(value: any): boolean;
    /**
     * Checks if the given value is an object
     */
    function isObject(value: any): boolean;
    /**
     * Wraps an object in an array if the object is not an array itself
     */
    function wrapInArray<T>(obj: any): Array<T>;
    /**
     * Copies keys and values from one object to another
     * @param {any} target
     * @param {any} source
     * @param {boolean} overwrite the child objects or arrays
     * @param {mergeArrays} will merge arrays instead of overwriting them
     */
    function apply(target: any, source: any, overwrite?: boolean, mergeArrays?: boolean): any;
    /**
     * Checks if the given value is a boolean
     */
    function isBoolean(value: any): boolean;
    /**
     * Checks if the give value is instance of another class/function
     */
    function isInstanceOf(obj: any, clazz: any): boolean;
    /**
     * Loops though the given object (array, dictionary) and runs a callback on each item.
     * The callback loop will break when the callback function returns "false" explicitly!
     * The callback has the following signature:
     * function(item:any, index:number|string, scope:any = obj) {
     * }
     */
    function forEach(obj: any, callback: Function, scope?: any): void;
    /**
     *  Create a new Blend.Component object
     */
    function createComponent<T extends Blend.Component>(clazz: ComponentTypes, config?: any): T;
    function isClass(clazz: any): boolean;
    /**
     * Registers a class with a given alias into the class registry so we can
     * instantiate an object with createObjectWithAlias.
     */
    function registerClassWithAlias(alias: string, clazz: ComponentClass): void;
}
declare namespace Blend {
    var version: string;
}


declare namespace Blend.ajax {
    /**
     * Base class for an Ajax Request
     */
    abstract class AjaxRequest extends Blend.Component {
        protected xhr: XMLHttpRequest;
        protected xhrConfig: DictionaryInterface;
        protected url: string;
        protected headers: DictionaryInterface;
        protected onComplete: Function;
        protected onProgress: Function;
        protected onFailed: Function;
        protected onSuccess: Function;
        protected onStart: Function;
        protected onPrepareUpload: Function;
        protected scope: any;
        protected callID: number;
        protected abstract doSendRequest(data: DictionaryInterface): void;
        constructor(config: string | AjaxRequestInterface);
        protected initialize(): void;
        sendRequest(data?: DictionaryInterface): void;
        protected updateProgress(request: XMLHttpRequest, evt: Event): void;
        protected transferComplete(request: XMLHttpRequest, evt: Event): void;
        protected transferFailed(request: XMLHttpRequest, evt: Event): void;
        protected transferCanceled(request: XMLHttpRequest, evt: Event): void;
        /**
         * File prepare event notification
         */
        protected notifyPrepareUpload(file: File, status: number): void;
        /**
         * Calls a registerend handler by name
         */
        private callHandler(name, args);
        /**
         * URI encode a string value
         */
        protected encodeURIComponent(value: string): string;
        /**
         * URL encode a Dictionary
         */
        protected urlEncodeData(data: DictionaryInterface): string;
        /**
         * Creates or updates the current URL by adding a call ID ti bypass browser caching
         */
        protected createURI(data?: DictionaryInterface): string;
    }
}


declare namespace Blend.ajax {
    /**
     * AjaxGetRequest implements a GET request
     */
    class AjaxGetRequest extends Blend.ajax.AjaxRequest {
        protected doSendRequest(data?: DictionaryInterface): void;
    }
}


declare namespace Blend.ajax {
    /**
     * AjaxPostRequest implements a POST request with File uploading capabilities
     */
    class AjaxPostRequest extends Blend.ajax.AjaxRequest {
        protected boundary: string;
        protected dataItemHeader: string;
        protected readyToSend: boolean;
        protected doSendRequest(data?: DictionaryInterface): void;
        /**
         * Encode the data that is to be sent (POST) asynchronously
         */
        protected boundaryEncodeData(data: DictionaryInterface, callback: Function): void;
        /**
         * Converts an ArrayBuffer (File) to a string
         */
        private arrayBufferToString;
        /**
         * Encodes a FileList
         */
        private encodeFileList(files, payload, onFinish);
        /**
         * Encodes simple data items
         */
        private encodeDataItem(key, value);
    }
}


declare namespace Blend.mvc {
    /**
     * Abstract class providing controller regsiteration and event publishing
     * This class is the base class for View and the Context
     */
    class Client extends Blend.Component {
        protected controllers: Array<Blend.mvc.Controller>;
        constructor(config?: MvcClientInterface);
        /**
         * Fires an event towards the Controllers within this View
         */
        protected fireEventWithScope(scope: any, eventName: string, args: Array<any>): void;
        /**
         * Adds (registers) Controllers with this client
         */
        addController(controllers: ControllerType | Array<ControllerType>): void;
    }
}


declare namespace Blend.mvc {
    class View extends Blend.mvc.Client {
        private reference;
        protected context: Blend.mvc.Context;
        protected eventsEnabled: boolean;
        protected currentEventName: string;
        constructor(config?: MvcViewInterface);
        /**
         * Sets the global MVC context
          */
        setContext(context: Blend.mvc.Context): void;
        /**
         * Checks to see if we have a global MVC context
         */
        hasContext(): boolean;
        /**
         * Disables the event and notification on this View
         */
        disableEvents(): Blend.mvc.Client;
        /**
         * Enables the event and notification on this view
         */
        enableEvents(): Blend.mvc.Client;
        /**
         * Gets the reference identifier for this View
         */
        getReference(): string;
        canFireEvents(): boolean;
        /**
         * Fires an event towards the Controllers within this View
         * and the current global Context is possible
         */
        fireEvent(eventName: string, ...args: any[]): Blend.mvc.Client;
    }
}


interface ControllerEventHandler {
    (view: Blend.mvc.View, ...args: any[]): void;
}
declare namespace Blend.mvc {
    /**
     * Base class for a Controller.
     */
    class Controller extends Blend.Component {
        private handlers;
        constructor(config?: any);
        protected initEvents(): void;
        /**
         * @internal
         * Delegates an event to the regisreted handlers in this controller
         */
        delegate(eventName: string, view: Client, args: any[]): void;
        /**
         * Registers an event handler within this controller
         */
        protected on(eventName: string, handler: ControllerEventHandler): void;
        /**
         * @internal
         * Registers a View's reference within this controller
         */
        bindView(view: Client | View): void;
    }
}


declare namespace Blend.mvc {
    /**
     * Represents a context that hols instanses of controllers an other
     *  mvc related state
     */
    class Context extends Blend.mvc.Client {
        /**
         * Delegates an event to the Controllers within this Context
         */
        delegate(eventName: string, sender: Client, args: Array<any>): void;
    }
}


declare namespace Blend.material {
    /**
     * Abstract base class for a Material
     */
    abstract class Material extends Blend.mvc.View {
        protected parent: Blend.material.Material;
        protected element: Blend.dom.Element;
        protected isRendered: boolean;
        protected visible: boolean;
        protected config: MaterialInterface;
        protected useParentControllers: boolean;
        protected isInitialized: boolean;
        protected canLayout: boolean;
        constructor(config?: MaterialInterface);
        /**
         * Internal function used for initiating a sub-layout process. This function can be
         * overridden when implementing a custom component. See the Button component as
         * an example of how to use this function
         */
        protected updateLayout(): void;
        /**
         * Initiates a sub-layout process.
         */
        protected performLayout(): void;
        /**
         * Suspends the sub-layout from staring
         */
        protected suspendLayout(): void;
        /**
         * Resumes the sub-layout
         */
        protected resumeLayout(): void;
        /**
         * This function is used internally on render time to assign element IDs to
         * properties
         */
        protected assignElementByOID(el: Blend.dom.Element, oid: string): void;
        /**
         * Initialized a responsive listener for this Material by adding a listener to the
         * Runtime.addMediaQueryListener
         */
        protected initializeResponsiveEvents(): void;
        getProperty<T>(name: string, defaultValue?: any): T;
        protected render(): Blend.dom.Element;
        /**
         * Sends a materialInitialized notification
         */
        protected notifyMaterialInitialized(): void;
        /**
         * DO NOT USE THIS FUNCTION!
         * Internal function that is called by the parent/host to initiate
         * the initialization process
          */
        doInitialize(): Blend.material.Material;
        /**
         * This function can be overriden to do custom initialization on this Material
         */
        initialize(): void;
        /**
         * Override this method for creating event listeners for this Material
         */
        protected initEvents(): void;
        /**
         * Check if events can be fired on this Material
         */
        canFireEvents(): boolean;
        /**
         * Returns the bounds of this Material based on the ElementBoundsInterface interface
         */
        getBounds(): ElementBoundsInterface;
        /**
         * Sets the bounds of this Material based on the ElementBoundsInterface interface
         */
        setBounds(bounds: ElementBoundsInterface): Blend.material.Material;
        /**
         * Sends boundsChanged notification
         */
        notifyBoundsChanged(): void;
        /**
         * Sets the visibility state for this Material
         */
        setVisible(visible?: boolean): Blend.material.Material;
        /**
         * gets the visibility state of this Material
         */
        isVisible(): boolean;
        /**
         * Sends a visibilityChanged notification
         */
        protected notifyVisibilityChanged(): void;
        /**
         * Sets the Styles for this Material
         * */
        setStyle(style: StyleInterface): void;
        /**
         * Adds one or more CSS classes to this Material
         */
        addCssClass(css: string | Array<string>): void;
        /**
         * Sends a visibilityChanged notification
         */
        protected notifyStyleOrCSSChanged(): void;
        /**
         *Helps configuring the this Material before the rendering cycle is complete
         */
        protected finalizeRender(): void;
        /**
        * Retrives the HTMLElement for this Material
        */
        getElement(): Blend.dom.Element;
        /**
         * Destroys this Material by setting the properties to null,
         * deleting them and removing its HTMLElement
         */
        destroy(): void;
    }
}


declare namespace Blend.application {
    /**
     * Base class for implementing an Application component
     */
    abstract class Application extends Blend.material.Material {
        protected config: ApplicationInterface;
        protected isStarted: boolean;
        protected isResizing: boolean;
        protected mainView: Blend.material.Material;
        constructor(config?: ApplicationInterface);
        /**
         * Used to fire an event when the browser is resized
         */
        protected notifyApplicationResized(evt: Event): void;
        /**
         * Handle the resize notification correctly
         */
        protected onWindowResize(): void;
        /**
         * Install an event listener on the window
         */
        protected setupWindowListeners(): void;
        /**
         * Fires when the application is ready for user interaction
         */
        protected notifyApplicationReady(): void;
        protected performInitialMediaQuery(): void;
        protected asyncRun(): void;
        /**
         * Creates the main view of this application
         * */
        protected createMainView(): void;
        protected renderMainView(): Blend.dom.Element;
        protected finalizeRender(): void;
        protected render(): Blend.dom.Element;
        /**
         * Entry point of a Blend application
         */
        run(): void;
    }
}


/**
 * This class is an adaptaion and ported from "Material Design Lite"
 */
interface RippleInterface extends DictionaryInterface {
    element?: Blend.dom.Element;
    center?: boolean;
    color?: string | Blend.dom.Element;
}
declare namespace Blend.material.effect {
    class Ripple extends Component {
        private element;
        private container;
        private currentRipple;
        private skipMouseEvent;
        private center;
        private rippleDuration;
        private removeQueue;
        protected color: string;
        constructor(config?: RippleInterface);
        protected bindEvents(): void;
        protected createRippleContainer(): void;
        protected handleDownEvent(evt: Event): void;
        protected handleHandleUpEvent(): void;
        protected initiateRipple(left: number, top: number): void;
        /**
         * Converts a hex color to a RGB format
         */
        private hexToRgb(value);
        protected setRippleColor(color: string | Blend.dom.Element): void;
    }
}


declare namespace Blend.dom {
    class ElementConfigBuilder {
        protected config: CreateElementInterface;
        constructor(config: string | CreateElementInterface);
        addChild(child: string | Blend.dom.ElementConfigBuilder | CreateElementInterface): Blend.dom.ElementConfigBuilder;
        setStyle(styles: StyleInterface): Blend.dom.ElementConfigBuilder;
        setSelectable(state: boolean): Blend.dom.ElementConfigBuilder;
        setText(text: string): Blend.dom.ElementConfigBuilder;
        addCSS(css: Array<string>): Blend.dom.ElementConfigBuilder;
        setOID(oid: string): Blend.dom.ElementConfigBuilder;
        setTag(tag: string): Blend.dom.ElementConfigBuilder;
        getConfig(): CreateElementInterface;
    }
}


declare namespace Blend.button {
    /**
     * Base class for implementing a Button
     */
    class Button extends Blend.material.Material {
        protected config: ButtonInterface;
        protected wrapperElement: Blend.dom.Element;
        protected textElement: Blend.dom.Element;
        protected iconElement: Blend.dom.Element;
        protected buttonTypes: Array<string>;
        protected fabPositions: Array<string>;
        protected iconSizes: DictionaryInterface;
        protected rippleEffect: Blend.material.effect.Ripple;
        constructor(config?: ButtonInterface);
        setState(value: boolean): Blend.button.Button;
        isEnabled(): boolean;
        private getCheclIconSize(iconSize);
        private getCheckFabPosition(fabPosition);
        private getCheckIconAlign(iconAlign);
        private getCheckButtonType(buttonType);
        setTheme(theme: string): Blend.button.Button;
        setButtonType(buttonType: string): Blend.button.Button;
        setText(text: string): Blend.button.Button;
        setIconSize(iconSize: string): Blend.button.Button;
        setIcon(icon: string): Blend.button.Button;
        setFabPosition(fabPosition: string): Blend.button.Button;
        protected updateLayout(): void;
        protected notifyClick(evt: Event): void;
        protected initEvents(): void;
        /**
         * Check if this button is a Floating Action Button
         */
        protected isFab(): boolean;
        /**
         * Check if this button is either a round-flat or round-raised
         */
        protected isRound(): boolean;
        protected render(): Blend.dom.Element;
    }
}


declare namespace Blend.container {
    class Container extends Blend.material.Material {
    }
}


/**
 * @interface
 * Interface for implementing a logger component
 */
interface LoggerInterface {
    open(): any;
    close(): any;
    log(type: string, message: string, context?: any): any;
    warn(message: string, context?: any): any;
    error(message: string, context?: any): any;
    info(message: string, context?: any): any;
    debug(message: string, context?: any): any;
}


interface RectangleInterface extends MaterialInterface {
    color?: string;
    border?: boolean;
}
declare namespace Blend.material {
    class Rectangle extends Blend.material.Material {
        protected config: RectangleInterface;
        private layoutCount;
        constructor(config?: RectangleInterface);
        protected layoutView(): void;
        protected finalizeRender(): void;
        private log();
    }
}


declare namespace Blend.mvc {
    /**
     * Provides a generic and bindable Model
     */
    class Model extends Blend.Component {
        protected data: DictionaryInterface;
        constructor(config?: DictionaryInterface);
        /**
        * Sets the values of the fields in this Model. This action triggers
        * all the handlers for bound View setters
        */
        setData(data: DictionaryInterface): void;
        /**
         * Gets the current data in this Model
         */
        getData(): DictionaryInterface;
        /**
         * Creates automatic properties for this Model when there are no
         * custom getters/setters available
         */
        private createProperties();
    }
}


declare namespace Blend.web {
    /**
     * Base class for a web/desktop application
     */
    class Application extends Blend.application.Application {
    }
}
