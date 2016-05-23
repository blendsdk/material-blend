/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('Material CSS', function(t: Blend.testing.TestRunner) {

    var mtr1: Blend.material.Material = Blend.createComponent<Blend.material.Material>(Blend.material.Material);
    t.assertEquals(mtr1.getElement().getEl().getAttribute('class'), null, 'no css');

    var mtr2: Blend.material.Material = Blend.createComponent<Blend.material.Material>(Blend.material.Material, {
        css: 'a'
    });
    t.assertEquals(mtr2.getElement().getEl().getAttribute('class'), 'a', 'css as string');

    var mtr3: Blend.material.Material = Blend.createComponent<Blend.material.Material>(Blend.material.Material, {
        css: ['a', 'b']
    });
    t.assertEquals(mtr3.getElement().getEl().getAttribute('class'), 'a b', 'css as array');

    t.done();

})