/// <reference path="../blend/blend.d.ts" />

export interface RectangleConfig extends MaterialInterface {
    color?: string
    border?: boolean
}

class Rectangle extends Blend.material.Material {

}

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

TestApp.defineTest('Material Elevate', function(t: Blend.testing.TestRunner) {

    var r = new Blend.material.Rectangle(<RectangleInterface>{
        width: 100,
        height: 100,
        color: '#fff',
        elevation: 4,

    });
    var body = Blend.getElement(document.body);
    body.addCssClass('default').clearElement();
    body.append(r.getElement());

    t.delay(function() {

        var cl = new Blend.dom.ClassList(r.getElement().getEl());
        t.assertTrue(cl.has('elevate-4'), 'has elevation');
        t.done();
    });
})