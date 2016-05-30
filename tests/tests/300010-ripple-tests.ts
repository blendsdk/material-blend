/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('Ripple functions CSS', function(t: Blend.testing.TestRunner) {

    class RippleTest extends Blend.material.effect.Ripple {

        public getColor() {
            return this.color;
        }
    }

    var el = Blend.createElement({
    });

    var r = new RippleTest({
        element: el
    });
    t.assertEquals(r.getColor(), 'rgba(0,0,0,0.95)');

    var r = new RippleTest({
        element: el,
        color:'#fffffe'
    });
    t.assertEquals(r.getColor(), 'rgba(255,255,254,0.95)');

    var r = new RippleTest({
        element: el,
        color:'yellow'
    });
    t.assertEquals(r.getColor(), 'rgba(0,0,0,0.95)');

    t.done();

})