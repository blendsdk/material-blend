TestApp.defineTest('Component Commons', function(t: Blend.testing.TestRunner) {

    class Greeter extends Blend.Component {

        public sayHello(name: string) : string {
            return 'Hello ' + name;
        }

    }

    var g1 = new Greeter()

    t.assertTrue(g1.hasFunction('sayHello'), 'has function');
    t.assertFalse(g1.hasFunction('abc'), 'has function');
    t.assertEquals(g1.applyFunction('sayHello', ['test']), 'Hello test', 'calling function');

    t.done();
});