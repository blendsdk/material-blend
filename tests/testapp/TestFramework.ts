/// <reference path="../blend/blend.d.ts" />

namespace Blend.testing {

    export interface TestConfig {
        name: string;
        testFn: (t: TestRunner) => void;
        pass: number;
        fail: number;
        testn?: number;
    }

    export class TestRunner {

        /**
         * The index of the next test case
         */
        nextTestIndex: number;

        /**
         * Reference to the current test
         */
        currentTest: TestConfig;

        /**
         * list of defined tests
         */
        private tests: Array<TestConfig>;

        /**
         * Indicates whether the test is started
         */
        testStarted: boolean = false;

        /**
         * Refenece to a Logger implementation
         */
        private logger: LoggerInterface

        /**
         * @constructor
         */
        constructor(logger: LoggerInterface) {
            var me = this;
            me.tests = [];
            me.logger = logger;
            me.nextTestIndex = 0;
        }

        /**
         * defineTest can de used to define a test
         */
        public defineTest(name: string, fn: (t: TestRunner) => void) {
            var me = this;
            me.tests.push({
                name: name,
                testFn: fn,
                pass: 0,
                fail: 0,
                testn: 0
            });

        }

        /**
         * Kick start the test
         */
        public run() {

            var me = this;
            if (console && console.clear) {
                console.clear();
            }

            window.onerror = <ErrorEventHandler>function(errorMsg: string, url: string, fileNo: number, lineNumber: number) {
                me.logger.error(errorMsg, { url: url, line: lineNumber });
            }

            var doCallback = function() {
                if (!me.testStarted) {
                    me.removeEventListener(document, 'DOMContentLoaded', doCallback);
                    me.removeEventListener(window, 'load', doCallback);
                    me.testStarted = true;
                    if (me.tests.length !== 0) {
                        me.logger.open();
                        me.runNextTest();
                    } else {
                        me.logger.warn("No tests to run!");
                    }
                }
            }

            if (document.readyState === "complete") {
                setTimeout(doCallback, 5);
            } else {
                me.addEventListener(document, 'DOMContentLoaded', doCallback);
                me.addEventListener(window, 'load', doCallback);
            }
        }

        /**
         * Executes the given function with delay
         */
        public delay(fn: Function, amount?: number) {
            var me = this,
                curTitle = document.title;
            amount = amount || 1000;

            document.title = `${amount} delay for ${me.currentTest.name}`;
            setTimeout(function() {
                fn();
                document.title = curTitle;
            }, amount);
        }

        public assertExists(actual: any, assertDescription?: string) {
            var me = this;
            if (actual !== null && actual !== undefined) {
                me.pass(assertDescription);
            } else {
                me.fail(`Failed to assert that ${actual} is not null/undefined`, actual, 'not null/undefined', assertDescription);
            }
        }

        public assertNotEquals(actual: any, expected: any, assertDescription?: string) {
            var me = this;
            if (!me._equal(actual, expected)) {
                me.pass(assertDescription)
            } else {
                me.fail(`Failed to assert that ${actual} NOT equals to ${expected}`, actual, expected, assertDescription);
            }
        }

        public assertEquals(actual: any, expected: any, assertDescription?: string) {
            var me = this;
            if (me._equal(actual, expected)) {
                me.pass(assertDescription)
            } else {
                me.fail(`Failed to assert that ${actual} equals to ${expected}`, actual, expected, assertDescription);
            }
        }

        public assertTrue(actual: boolean, assertDescription?: string) {
            var me = this;
            if (actual !== true) {
                me.fail(`Failed to assert that ${actual} is TRUE!`, actual, true, assertDescription);
            } else {
                me.pass(assertDescription);
            }
        }

        public assertFalse(actual: boolean, assertDescription?: string) {
            var me = this;
            if (actual !== false) {
                me.fail(`Failed to assert that ${actual} is FALSE!`, actual, true, assertDescription);
            } else {
                me.pass(assertDescription);
            }
        }

        private _equal(actual: any, expected: any) {
            var me = this;
            var check = function(a: any, b: any): boolean {
                if (me.get_obj_type(a) === me.get_obj_type(b)) {
                    if (me.is_array(a)) {
                        if (a.length === b.length) {
                            for (var i = 0; i !== a.length; i++) {
                                if (!check(a[i], b[i])) {
                                    return false;
                                }
                            }
                            return true;
                        } else {
                            return false;
                        }
                    } else if (me.is_object(a)) {
                        var akeys = Object.keys(a),
                            bkeys = Object.keys(b);
                        if (akeys.length === bkeys.length) {
                            for (var k in a) {
                                if (!check(a[k], b[k])) {
                                    return false;
                                }
                            }
                            return true;
                        } else {
                            return false;
                        }

                    } else if (me.is_function(a)) {
                        return a.length === b.length;
                    } else if (me.is_regexp(a)) {
                        throw new Error("Don't know how to compare RegExps!");
                    } else {
                        return a === b;
                    }
                } else {
                    return false;
                }
            };
            return check(actual, expected);
        }

        /**
         * Check if the value is an array
         */
        private is_array(value: any): boolean {
            return Object.prototype.toString.apply(value) === '[object Array]';
        }


        /**
         * Check if the value is a function
         */
        private is_function(value: any): boolean {
            return typeof (value) === 'function';
        }

        /**
         * Check if the value is a string
         */
        private is_string(value: any): boolean {
            return typeof value === 'string';
        }

        /**
         * Check if the value is null
         */
        private is_null(value: any): boolean {
            return value === null || value === undefined;
        }

        /**
         * Check if the value is an object
         */
        private is_object(value: any): boolean {
            var me = this;
            return (typeof (value) === "object" &&
                !me.is_array(value) &&
                !me.is_function(value) &&
                !me.is_null(value) &&
                !me.is_string(value)
            );
        }

        /**
         * Check if the value is a number
         */
        private is_number(value: any): boolean {
            // Original source: JQuery
            return value - parseFloat(value) >= 0;
        }

        /**
         * Check if the value is regexp
         */
        private is_regexp(value: any): boolean {
            return (value instanceof RegExp);
        }

        /**
         * Gets the type of an object
         */
        private get_obj_type(obj: any): string {
            var me = this;
            if (me.is_string(obj)) {
                return 'string';
            } else if (me.is_array(obj)) {
                return 'array';
            } else if (me.is_number(obj)) {
                return 'number';
            } else if (me.is_object(obj)) {
                return 'object';
            } else if (me.is_function(obj)) {
                return 'function';
            } else if (me.is_null(obj)) {
                return 'null';
            } else if (me.is_regexp(obj)) {
                return 'regexp';
            }
        }


        /**
         * Logs a test as failed
         */
        private fail(failMessage: string, actual: any, expected: any, assertDescription?: string) {
            var me = this;
            me.logger.log("fail", failMessage, {
                test: me.currentTest.name,
                assert: assertDescription || 'Test #' + me.currentTest.testn,
                actual: actual,
                expected: expected,
                failMessage: failMessage
            });
            me.currentTest.testn++;
            me.currentTest.fail++;
        }

        /**
         * Logs a test as passed
         */
        private pass(assertDescription?: string) {
            var me = this;
            me.logger.log("pass", assertDescription || 'Test #' + me.currentTest.testn);
            me.currentTest.testn++;
            me.currentTest.pass++;
        }

        /**
         * Should be called after a test is done to let the test runner to continue
         */
        done(delayDone: number = 0) {
            var me = this;
            if (me.currentTest.pass === 0 && me.currentTest.fail === 0) {
                me.logger.warn(`Nothing was tested in [${me.currentTest.name}]!`);
            }
            me.nextTestIndex++;
            if (delayDone !== 0) {
                setTimeout(function() {
                    me.runNextTest();
                }, delayDone);
            } else {
                me.runNextTest();
            }
        }

        /**
         * Runs the next test from the defined tests
         */
        private runNextTest() {
            var me = this;
            me.currentTest = me.tests[me.nextTestIndex];
            if (me.currentTest) {
                me.currentTest.testFn.apply(me, [me]);
            } else {
                me.testFinished();
            }
        }

        /**
         * Called when all tests are ran.
         */
        private testFinished() {
            var me = this;
            me.logger.info("No more tests to run in this group.");
            me.logger.close();
        }

        /**
         * Adds an event listener
         */
        private addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.addEventListener(eventName, eventHandler, false);
        }

        /**
         * Removes an event listener
         */
        private removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.removeEventListener(eventName, eventHandler, false);
        }

    }
}
