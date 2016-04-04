/// <reference path="dom/Element.ts" />

namespace Blend {

    /**
     * CSS Prefix value made available from code
     */
    export var CSS_PREFIX = 'b-';

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

}

/**
 * Shorthand function to wrap a HTMLElement into a Blend.dom.Element
 */
var wrapEl = function(el: HTMLElement) {
    return new Blend.dom.Element(el);
}