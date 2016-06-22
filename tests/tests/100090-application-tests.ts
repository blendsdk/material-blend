TestApp.defineTest("Application Run", function (t: Blend.testing.TestRunner) {
    var app = new Blend.web.Application({
        items: ["mb.rect"],
        controller: function (view: any, event: string) {
            if (event === "applicationReady") {
                t.assertTrue(true, "applicationReady fired");
                t.done();
            }
        }
    });
    app.run();
});