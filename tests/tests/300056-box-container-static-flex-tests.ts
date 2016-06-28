TestApp.defineTest("Box Container Static Flex", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var cntr = new Blend.container.HorizontalBox({
        width: 500,
        height: 100,
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
    t.assertEquals(elements.length, 3, "correct stretched elements");
    t.assertEquals(elements[0].getBounds().width, 150, "flex: 1");
    t.assertEquals(elements[1].getBounds().width, 200, "static 200");
    t.assertEquals(elements[2].getBounds().width, 150, "flex: 1");

    t.done(250);

});
