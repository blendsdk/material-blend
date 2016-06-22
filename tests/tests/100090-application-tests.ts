TestApp.defineTest("Application Run", function (t: Blend.testing.TestRunner) {
    var app = new Blend.web.Application({
        mainView: {
            ctype: "mb.rect",
            color: "orange"
        },
        controller: function (view: any, event: string) {
            if (event === "applicationReady") {
                t.assertTrue(true, "applicationReady fired");
                t.done();
            }
        }
    });
    app.run();
});

TestApp.defineTest("Application Run Not Fitted", function (t: Blend.testing.TestRunner) {
    var app = new Blend.web.Application({
        fitMainView: false,
        mainView: {
            ctype: "mb.rect",
            color: "magenta",
            width: 200,
            height: 150
        },

        controller: function (view: any, event: string) {
            var me = this;
            if (event === "applicationReady") {
                var bounds = me.mainView.getElement().getBounds();
                t.assertEquals(bounds.width, 200, "width correct");
                t.assertEquals(bounds.height, 150, "height correct");
                t.done();
            }
        }
    });
    app.run();
});