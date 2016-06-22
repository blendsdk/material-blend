/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest("Fit Container", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var fit1 = new Blend.container.Fit({
        width: 400,
        height: 300,
        items: [
            {
                ctype: "mb.rect",
                color: "blue",
                css: "rect1"
            }
        ]
    });

    bodyEl.append(fit1.getElement());
    fit1.doInitialize();
    fit1.performLayout();

    var bounds = Blend.selectElement(".rect1").getBounds();

    t.assertEquals(bounds.width, 400, "width is okay");
    t.assertEquals(bounds.height, 300, "height is okay");

    t.done(200);

});

TestApp.defineTest("Fit Container", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var fit1 = new Blend.container.Fit({
        width: 200,
        height: 180,
        padding: 10,
        items: [
            {
                ctype: "mb.rect",
                color: "orange",
                css: "rect2"
            }
        ]
    });

    bodyEl.append(fit1.getElement());
    fit1.doInitialize();
    fit1.performLayout();

    var bounds = Blend.selectElement(".rect2").getBounds();

    t.assertEquals(bounds.width, 180, "width is okay");
    t.assertEquals(bounds.height, 160, "height is okay");

    t.done(200);

});