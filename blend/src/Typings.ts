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
type ComponentTypes = ComponentClass | ComponentConfig | string;
type ControllerType = ComponentClass | Blend.mvc.Controller | FunctionAsController | string;

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
type MaterialType = string | ComponentClass | MaterialInterface | ContainerMaterialInterface | Blend.material.Material;

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
