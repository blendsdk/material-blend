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

TestApp.defineTest('UI View Delete', function(t: Blend.testing.TestRunner) {

    Blend.Runtime.ready(function() {
        var view1: Blend.ui.View = Blend.createComponent<Blend.ui.View>(Blend.ui.View, {
            style: {
                'border-width': 1
            }
        });
        document.body.innerHTML = '';
        document.body.appendChild(view1.getElement());
        t.delay(function() {
            t.assertEquals(document.body.children.length, 1, 'View added to body');
            view1.destroy();
            t.assertEquals(document.body.children.length, 0, 'View destroyed');
            t.done();
        });
    });
    Blend.Runtime.kickStart();
});


TestApp.defineTest('UI View Visibility', function(t: Blend.testing.TestRunner) {

    Blend.Runtime.ready(function() {
        var view1: Blend.ui.View = Blend.createComponent<Blend.ui.View>(Blend.ui.View, {
            controller: function(view: any, eventName: string, state: boolean) {
                t.assertFalse(state, 'view is hidden now');
            }
        });
        document.body.appendChild(view1.getElement());
        t.delay(function() {
            view1.setVisible(false);
            t.done();
        });

    });
    Blend.Runtime.kickStart();
});

TestApp.defineTest('UI View Bounds', function(t: Blend.testing.TestRunner) {

    Blend.Runtime.ready(function() {
        var view1: Blend.ui.View = Blend.createComponent<Blend.ui.View>(Blend.ui.View, {
            width: 100,
            height: 100,
            top: 10,
            left: 10
        });
        document.body.appendChild(view1.getElement());
        t.delay(function() {
            var bounds: ElementBoundsInterface = view1.getBounds();
            t.assertEquals(bounds.width, 100, 'correct width');
            t.assertEquals(bounds.height, 100, 'correct height');
            t.assertEquals(bounds.top, 10, 'correct top');
            t.assertEquals(bounds.left, 10, 'correct left');
            t.done();
        });

    });
    Blend.Runtime.kickStart();
});