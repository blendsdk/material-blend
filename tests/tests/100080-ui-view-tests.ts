/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('UI View CSS', function(t: Blend.testing.TestRunner) {

    var view1: Blend.ui.View = Blend.createComponent<Blend.ui.View>(Blend.ui.View);
    t.assertEquals(view1.getElement().getAttribute('class'), null, 'no css');

    var view2: Blend.ui.View = Blend.createComponent<Blend.ui.View>(Blend.ui.View, {
        css: 'a'
    });
    t.assertEquals(view2.getElement().getAttribute('class'), 'a', 'css as string');

    var view3: Blend.ui.View = Blend.createComponent<Blend.ui.View>(Blend.ui.View, {
        css: ['a', 'b']
    });
    t.assertEquals(view3.getElement().getAttribute('class'), 'a b', 'css as array');


    var rect1: Blend.ui.Rectangle = Blend.createComponent<Blend.ui.Rectangle>('ui.rect');
    t.assertEquals(rect1.getElement().getAttribute('class'), 'b-rectangle', 'own ui CSS');

    var rect2: Blend.ui.Rectangle = Blend.createComponent<Blend.ui.Rectangle>('ui.rect', {
        css: ['c', 'd']
    });
    t.assertEquals(rect2.getElement().getAttribute('class'), 'b-rectangle c d', 'own ui CSS with custom');

    t.done();

});


TestApp.defineTest('UI View Style', function(t: Blend.testing.TestRunner) {

    var view1: Blend.ui.View = Blend.createComponent<Blend.ui.View>(Blend.ui.View, {
        style: {
            'border-width': 1
        }
    });
    t.assertTrue(view1.getElement().getAttribute('style').indexOf('border-width: 1px') !== -1, 'style set');
    t.done();

});