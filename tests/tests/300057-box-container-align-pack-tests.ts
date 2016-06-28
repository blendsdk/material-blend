TestApp.defineTest("Box Container Align & Pack", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var cntr = new Blend.container.HorizontalBox({
        width: 300,
        height: 400,
        align: Blend.eBoxAlign.stretch,
        style: {
            border: "1px solid grey"
        },
        items: [
            {
                ctype: "mb.rect",
                color: "red",
                width: 0,
                flex: 1
            },
            {
                ctype: "mb.rect",
                color: "blue",
                width: 200
            },
            {
                ctype: "mb.rect",
                color: "orange",
                flex: 1,
                width: 0
            }
        ]
    });

    bodyEl.append(cntr.getElement());
    cntr.doInitialize();
    cntr.performLayout();

    var elements = Blend.selectElements(".m-rectangle");
    elements.forEach(function (el: Blend.dom.Element) {
        t.assertEquals(el.getBounds().height, 398, "height correct");
    });

    t.done(250);

});
