/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('MVC Context', function(t: Blend.testing.TestRunner) {

    Blend.mvcContext.addModel('m', new Blend.mvc.Model({
        key1:'key1'
    }));

    var m = Blend.mvcContext.getModel('m');
    t.assertFalse(Blend.isNullOrUndef(m), 'model returned');
    t.assertEquals(m.getData().key1, 'key1','model value is correct');

    t.done();

});