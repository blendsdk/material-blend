TestApp.defineTest("Box Container No Flex", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var cntr = new Blend.container.HorizontalBox({
        width: 400,
        height: 400,
        style: {
            border: "1px solid grey"
        },
        items: [
            {
                ctype: "mb.button",
                text: "Button 1"
            },
            {
                ctype: "mb.button",
                text: "Click Me",
            },
            {
                ctype: "mb.button",
                text: "Save"
            }
        ]
    });

    bodyEl.append(cntr.getElement());
    cntr.doInitialize();
    cntr.performLayout();

    var elements = Blend.selectElements(".mb-btn");
    t.assertEquals(elements.length, 3, "correct stretched elements");
    elements.forEach(function (el: Blend.dom.Element) {
        var values = <any>el.getStyle(["flex-grow", "flex-shrink", "flex-basis"]);
        t.assertEquals(values["flex-grow"], 0, "correct grow");
        t.assertEquals(values["flex-shrink"], 0, "correct shrink");
        t.assertEquals(values["flex-basis"], "auto", "correct shrink");
    });

    t.done(250);

});
