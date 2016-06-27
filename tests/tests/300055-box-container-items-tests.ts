function createStretchTest(property: string, clazz: any) {
    TestApp.defineTest("Box Container Stretch Check (" + property + ")", function (t: Blend.testing.TestRunner) {

        var bodyEl = Blend.getElement(document.body);
        bodyEl.clearElement();

        var cntr = new clazz({
            width: 400,
            height: 400,
            align: Blend.eBoxAlign.stretch,
            style: {
                border: "1px solid grey"
            },
            items: [
                {
                    ctype: "mb.rect",
                    color: "red"
                },
                {
                    ctype: "mb.rect",
                    color: "blue"
                },
                {
                    ctype: "mb.rect",
                    color: "orange"
                }
            ]
        });

        bodyEl.append(cntr.getElement());
        cntr.doInitialize();
        cntr.performLayout();

        var elements = Blend.selectElements(".m-rectangle");
        t.assertEquals(elements.length, 3, "correct stretched elements");
        elements.forEach(function (el: Blend.dom.Element) {
            var bounds = <any>el.getBounds();
            t.assertEquals(bounds[property], 398, property + " was " + bounds[property]);
        });

        t.done(250);

    });

}

createStretchTest("height", Blend.container.HorizontalBox);
createStretchTest("width", Blend.container.VerticalBox);


