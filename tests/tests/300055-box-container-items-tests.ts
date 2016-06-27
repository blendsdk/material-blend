TestApp.defineTest("Box Container Rverse Check", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var cntr = new Blend.container.HorizontalBox({
        width: 400,
        height: 350,
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

    t.done();

});

