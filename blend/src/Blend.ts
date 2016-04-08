/// <reference path="common/Utils.ts" />
/// <reference path="dom/Element.ts" />
/// <reference path="./Runtime.ts" />

namespace Blend {

    export var registry: ClassRegistryInterface = {};

    /**
     * Put the framework in DEBUG mode
     */
    export var DEBUG: boolean = false;

    /**
     * Checks if the given value is a function
     */
    export function isFunction(value: any): boolean {
        return (typeof value === 'function');
    }

    /**
     * Checks if the given value is a string
     */
    export function isString(value: any): boolean {
        return (typeof value === 'string');
    }

    /**
     * Checks if the given value is null or undefined
     */
    export function isNullOrUndef(value: any): boolean {
        return (value === null || value === undefined);
    }

    /**
      * Checks if the given value is an array
      */
    export function isArray(value: any) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }

    /**
     * Checks if the given value is a number
     */
    export function isNumeric(value: any): boolean {
        // Original source: JQuery
        return value - parseFloat(value) >= 0;
    }

    /**
     * Checks if the given value is an object
     */
    export function isObject(value: any) {
        return (typeof value === "object" &&
            (typeof value !== "function" &&
                value !== null &&
                value !== undefined &&
                !Blend.isArray(value)));
    }

    /**
     * Wraps an object in an array if the object is not an array itself
     */
    export function wrapInArray<T>(obj: any): Array<T> {
        return Blend.isArray(obj) ? obj : Blend.isNullOrUndef(obj) ? [] : [obj];
    }

    /**
     * Copies keys and values from one object to another
     * @param {any} target
     * @param {any} source
     * @param {boolean} overwrite the child objects or arrays
     * @param {mergeArrays} will merge arrays instead of overwriting them
     */
    export function apply(target: any, source: any, overwrite: boolean = false, mergeArrays: boolean = false): any {
        var key: any,
            targetKeys = Object.keys(target || {}),
            targetHasKey = function(key: string): boolean {
                return targetKeys.indexOf(key) !== -1
            }
        overwrite = overwrite || false;
        mergeArrays = mergeArrays || false;

        if (target && source) {
            for (key in source) {
                if (key) {
                    if (targetHasKey(key) && Blend.isObject(target[key])) {
                        if (overwrite) {
                            target[key] = source[key];
                        } else {
                            Blend.apply(target[key], source[key]);
                        }
                    } else if (targetHasKey(key) && Blend.isArray(target[key]) && mergeArrays === true) {
                        target[key] = target[key].concat(Blend.wrapInArray(source[key]));
                    } else if (targetHasKey(key) && overwrite) {
                        target[key] = source[key];
                    } else if (Blend.isNullOrUndef(target[key])) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    }

    /**
     * Checks if the give value is instance of another class/function
     */
    export function isInstanceOf(obj: any, clazz: any): boolean {

        if (obj === null || obj === undefined) {
            return false;
        }

        var hc = '[object HTMLCollection]';
        if (obj.toString() === hc && clazz === 'HTMLCollection') {
            return true;
        } else {
            if (Blend.isString(clazz)) {
                var fn = new Function('', ' try { return ' + clazz + ' } catch(e) { return null };');
                clazz = fn();
            }
            try {
                var res = (obj instanceof clazz);
                return res;
            } catch (e) {
                return false;
            }
        }
    }

    /**
     * Loops though the given object (array, dictionary) and runs a callback on each item.
     * The callback loop will break when the callback function returns "false" explicitly!
     * The callback has the following signature:
     * function(item:any, index:number|string, scope:any = obj) {
     * }
     */
    export function forEach(obj: any, callback: Function, scope?: any) {
        if (typeof HTMLCollection === 'undefined') {
            var HTMLCollection = function() {
                //
            };
        }
        var key: any;
        if (obj) {
            if (Blend.isFunction(obj)) {
                return;
            } else if (Blend.isArray(obj)) {
                var length: number = obj.length;
                for (key = 0; key < length; key++) {
                    if (callback.call(scope, obj[key], parseInt(key), obj) === false) {
                        break;
                    }
                }
            } else if (Blend.isInstanceOf(obj, 'HTMLCollection')) {
                var length: number = obj.length, key: any, el: HTMLElement;
                for (key = 0; key !== length; key++) {
                    el = obj.item(key);
                    if (key !== 'length') {
                        if (callback.call(scope, el, parseInt(key), obj) === false) {
                            break;
                        }
                    }
                }
            } else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (callback.call(scope, obj[key], key, obj) === false) {
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     *  Create a new Blend.Component object
     */
    export function createComponent(clazz: ComponentTypes, config: any = null): Blend.Component {
        if (typeof (clazz) === 'string') {
            if (Blend.registry[(<string>clazz)]) {
                return Blend.createComponent(Blend.registry[(<string>clazz)], config);
            } else {
                throw new Error(`Unknown class alias ${clazz}`);
            }
        } else if (typeof (clazz) === 'function' && !!Object.keys((<any>clazz).prototype).length === true) {
            return new (<ComponentClass>clazz)(config || {});
        } else if (typeof (clazz) === 'object' && (<ComponentConfig>clazz).ctype) {
            var ctype = (<ComponentConfig>clazz).ctype;
            delete ((<ComponentConfig>clazz).ctype);
            return Blend.createComponent(ctype, Blend.apply(clazz, config));
        } else {
            throw new Error(`Unable to create an object from ${clazz}`);
        }
    }

    /**
     * Registers a class with a given alias into the class registry so we can
     * instantiate an object with createObjectWithAlias.
     */
    export function registerClassWithAlias(alias: string, clazz: ComponentClass) {
        if (!registry[alias]) {
            Blend.registry[alias] = clazz;
        } else {
            throw new Error(`A Class with alias ${alias} is already registered!`);
        }
    }

}