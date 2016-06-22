TestApp.defineTest("Stack Container", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var stack1 = new Blend.container.Stack({
        width: 400,
        height: 300,
        items: [
            {
                ctype: "mb.rect",
                color: "red",
                css: "rect1"
            },
            {
                ctype: "mb.rect",
                color: "blue",
                css: "rect2"
            },
            {
                ctype: "mb.rect",
                color: "orange",
                css: "rect3"
            }
        ]
    });

    bodyEl.append(stack1.getElement());
    stack1.doInitialize();
    stack1.performLayout();

    var rect2 = Blend.selectElement(".rect2");
    stack1.setActiveItem(1);

    var tests = {
        rect1: false,
        rect2: true,
        rect3: false
    };

    Blend.forEach(tests, function (state: boolean, id: string) {
        var rect = Blend.selectElement("." + id);
        var rectState = rect.getData("visible");
        t.assertEquals(rectState, state, "State of " + id + " is correct");
    });

    t.done(200);

});

