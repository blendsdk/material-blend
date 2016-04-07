/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest("Blend Singleton", function(t: Blend.testing.TestRunner) {

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

    var a = 1;
    t.assertEquals([1], Blend.wrapInArray(a), 'Blend.wrapInArray:1');

    //Blend.apply
    var src: any = { a: 1, b: 2 }
    var dst: any = {};
    Blend.apply(dst, src)
    t.assertEquals(dst, src, 'src equals to dst');
    /////////////////////////////

    dst['x'] = 26
    t.assertNotEquals(dst, src, 'dst doest not equal to src');

    var ar1: any = [1, 2, 3, 4]
    var ar2: any = []
    Blend.apply(ar2, ar1);
    t.assertEquals(ar1, ar2, 'ar1 equals to ar2');
    /////////////////////////////


    var o1: any = {
        nu: 1,
        ar: [1, 2]
    }

    var o2: any = {
        nu: 1,
        ar: [3, 4]
    }

    Blend.apply(o2, o1, false, true);
    t.assertEquals(o2.ar, [3, 4, 1, 2], 'arrays merged');
    //////////////////////////////

    t.done();
});

TestApp.defineTest("Blend forEach", function(t: Blend.testing.TestRunner) {

    var el = document.createElement('div');
    el.innerHTML = "<span>a</span><span>b</span><span>c</span>";
    var text: Array<string> = [];
    Blend.forEach(el.children, function(item: HTMLElement, key: number) {
        text.push(item.innerHTML);
    });

    t.assertEquals(text, ['a', 'b', 'c'], 'forEach HTMLCollection');

    t.done();
});


TestApp.defineTest("Blend createComponent", function(t: Blend.testing.TestRunner) {

    interface GreeterInterface {
        name?: string;
    }

    class Greeter extends Blend.Component {

        private name: string;

        constructor(config: GreeterInterface) {
            super(config);
            this.name = config.name || 'Blend';
        }

        public sayHello() {
            return 'Hello ' + this.name;
        }
    }

    var o1 = Blend.createComponent(Greeter);
    t.assertTrue(Blend.isInstanceOf(o1, Greeter));

    var o2 = Blend.createComponent({
        ctype: Greeter
    });
    t.assertTrue(Blend.isInstanceOf(o2, Greeter));

    var o3 = <Greeter>Blend.createComponent(Greeter, { name: 'o3' });
    t.assertEquals(o3.sayHello(), 'Hello o3');

    var o4 = <Greeter>Blend.createComponent({
        ctype: Greeter,
        name: 'o4'
    })
    t.assertEquals(o4.sayHello(), 'Hello o4');

    t.done();
});