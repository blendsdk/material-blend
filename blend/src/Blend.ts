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

namespace Blend {

    export var registry: ClassRegistryInterface = {};

    /**
     * Put the framework in DEBUG mode
     */
    export var DEBUG: boolean = false;
    var ID = 1000;

    export var COMMON_MEDIA_QUERIES: DictionaryInterface = {};

    /**
     * IMPORTANT: For the media queries to work properly, we need to define them from
     * large to small because the Media Query check will match the first one and
     * trigger the responsiveChange event and other matching mediea queries will be
     * ignored!
     */
    COMMON_MEDIA_QUERIES[eMediaQuery.LARGE] = "(min-width : 840px)";
    COMMON_MEDIA_QUERIES[eMediaQuery.MEDIUM] = "(min-width: 480px) and (max-width: 839px)";
    COMMON_MEDIA_QUERIES[eMediaQuery.SMALL] = "(max-width : 479px)";


    /**
     * Bind wraps a function into a new functions so it can run in a given scope
     * when the new function is called.
     */
    export function bind(scope: any, fn: Function) {
        return function () {
            fn.apply(scope, arguments);
        };
    }

    /**
     * Runs a function in a given scope on a given timeout
     */
    export function delay(timeout: number, scope: any, fn: Function) {
        setTimeout(Blend.bind(scope, fn), timeout);
    }

    /**
     * Generates a new sequential ID used internally for debugging
     */
    export function newID(): number {
        return ID++;
    }

    /**
     * Returns enum value, either the value as number or its string representation
     */
    export function parseEnum<T>(objEnum: any, value: string | number): T {
        if (!Blend.isString(value)) {
            value = value.toString();
        }
        return objEnum[value] === undefined ? null : objEnum[value];
    }

    /**
     * Checks if the given value is a function
     */
    export function isFunction(value: any): boolean {
        return (typeof value === "function");
    }

    /**
     * Checks if the given value is a string
     */
    export function isString(value: any): boolean {
        return (typeof value === "string");
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
        return Object.prototype.toString.apply(value) === "[object Array]";
    }

    /**
     * Checks if the given value is a number
     */
    export function isNumeric(value: any): boolean {
        // Original source: JQuery
        return value - parseFloat(value) >= 0;
    }

    /**
     * Checks if the given value os a number or a string
     */
    export function isNumberOrString(value: any) {
        // we redundent code here.
        return (typeof value === "string") || (value - parseFloat(value) >= 0);
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
            targetHasKey = function (key: string): boolean {
                return targetKeys.indexOf(key) !== -1;
            };
        overwrite = overwrite || false;
        mergeArrays = mergeArrays || false;

        if (target && source) {
            for (key in source) {
                if (key && source.hasOwnProperty(key)) {
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
     * Checks if the given value is a boolean
     */
    export function isBoolean(value: any): boolean {
        return (typeof (value) === "boolean");
    }

    /**
     * Checks if the give value is instance of another class/function
     */
    export function isInstanceOf(obj: any, clazz: any): boolean {

        if (obj === null || obj === undefined) {
            return false;
        }

        var hc = "[object HTMLCollection]";
        if (obj.toString() === hc && clazz === "HTMLCollection") {
            return true;
        } else {
            if (Blend.isString(clazz)) {
                var fn = new Function("", " try { return " + clazz + " } catch(e) { return null };");
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
        if (typeof HTMLCollection === "undefined") {
            var HTMLCollection = function () {
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
            } else if (Blend.isInstanceOf(obj, "HTMLCollection")) {
                var length: number = obj.length, key: any, el: HTMLElement;
                for (key = 0; key !== length; key++) {
                    el = obj.item(key);
                    if (key !== "length") {
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
    export function createComponent<T extends Blend.Component>(clazz: ComponentTypes, config: any = null): T {
        if (typeof (clazz) === "string") {
            if (Blend.registry[(<string>clazz)]) {
                return Blend.createComponent<T>(Blend.registry[(<string>clazz)], config);
            } else {
                throw new Error(`Unknown class alias ${clazz}`);
            }
        } else if (Blend.isClass(clazz)) {
            return <T>new (<ComponentClass>clazz)(config || {});
        } else if (clazz !== null && clazz !== undefined && typeof (clazz) === "object" && (<ComponentConfig>clazz).ctype) {
            var ctype = (<ComponentConfig>clazz).ctype;
            delete ((<ComponentConfig>clazz).ctype);
            return Blend.createComponent<T>(ctype, Blend.apply(clazz, config));
        } else {
            throw new Error(`Unable to create an object from ${clazz}`);
        }
    }

    export function isClass(clazz: any) {
        return typeof (clazz) === "function" && !!Object.keys((<any>clazz).prototype).length === true;
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

if (typeof console === "object") {
    console.log(
        " __  __       _            _       _   ____  _                _ \n" +
        "|  \\/  | __ _| |_ ___ _ __(_) __ _| | | __ )| | ___ _ __   __| |\n" +
        "| |\\/| |/ _` | __/ _ \\ '__| |/ _` | | |  _ \\| |/ _ \\ '_ \\ / _` |\n" +
        "| |  | | (_| | ||  __/ |  | | (_| | | | |_) | |  __/ | | | (_| |\n" +
        "|_|  |_|\\__,_|\\__\\___|_|  |_|\\__,_|_| |____/|_|\\___|_| |_|\\__,_|\n\n" +
        "Hi there, fellow developer!\n\n" +
        "I hope this library can help you create great many applications.\n\n" +
        "Thanks for visiting and please let me know if you happen to find\n" +
        "any bugs. https://github.com/blendsdk/material-blend\n\n"
    );
}