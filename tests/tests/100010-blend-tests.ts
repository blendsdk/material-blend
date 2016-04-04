/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest("Blend Singleton", function(t: Blend.testing.TestRunner) {

    t.assertEquals('b-', Blend.CSS_PREFIX);
    t.assertExists(wrapEl);

    var f = function() { };
    t.assertTrue(Blend.isFunction(f), 'Blend.isFunction:true');
    t.assertFalse(Blend.isFunction(1), 'Blend.isFunction:false');

    t.assertTrue(Blend.isString(''), 'Blend.isString:true');
    t.assertFalse(Blend.isString(1), 'Blend.isString:false');

    t.assertTrue(Blend.isNullOrUndef(null), 'Blend.isNullOrUndef:null,true');
    t.assertTrue(Blend.isNullOrUndef(undefined), 'Blend.isNullOrUndef:undefined:true');
    t.assertFalse(Blend.isNullOrUndef(1), 'Blend.isNullOrUndef:false');

    t.assertTrue(Blend.isArray([]), 'Blend.isArray:true');
    t.assertFalse(Blend.isArray({}), 'Blend.isArray:false');

    t.assertTrue(Blend.isNumeric(3.32), 'Blend.isNumeric:true');
    t.assertTrue(Blend.isNumeric(-1), 'Blend.isNumeric:-1');
    t.assertTrue(Blend.isNumeric(3), 'Blend.isNumeric:3');
    t.assertTrue(Blend.isNumeric(0), 'Blend.isNumeric:0');
    t.assertFalse(Blend.isNumeric(false), 'Blend.isNumeric:false');
    t.assertTrue(Blend.isNumeric('0'), 'Blend.isNumeric:"0":false');
    t.assertTrue(Blend.isNumeric('1'), 'Blend.isNumeric:"1":false');

    t.assertTrue(Blend.isObject({}), '{} is an object');
    t.assertFalse(Blend.isObject(null), 'null not object');
    t.assertFalse(Blend.isObject([]), '[]] not object');
    t.assertFalse(Blend.isObject(function() { }), 'function not object');
    t.assertFalse(Blend.isObject(undefined), 'undef not object');
    t.assertFalse(Blend.isObject(""), '"" not object');
    t.assertFalse(Blend.isObject(11), '11 not object');


    t.done();
});

