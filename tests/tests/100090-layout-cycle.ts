/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('UI View Layout', function(t: Blend.testing.TestRunner) {

    Blend.Runtime.ready(function() {

        // var view1: Blend.ui.View = Blend.createComponent<Blend.ui.View>(Blend.ui.View, {
        //     width: 100,
        //     height: 100,
        //     top: 10,
        //     left: 10
        // });
        // document.body.appendChild(view1.getElement());
        // t.delay(function() {
        //     var bounds: ElementBoundsInterface = view1.getBounds();
        //     t.assertEquals(bounds.width, 100, 'correct width');
        //     t.assertEquals(bounds.height, 100, 'correct height');
        //     t.assertEquals(bounds.top, 10, 'correct top');
        //     t.assertEquals(bounds.left, 10, 'correct left');
        //     t.done();
        // });
        t.done();

    });
    Blend.Runtime.kickStart();
});