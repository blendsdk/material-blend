/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('Application Run', function(t: Blend.testing.TestRunner) {
    var app = new Blend.web.Application({
        mainView: 'mb.rect',
        controller: function(view: any, event: string) {
            if (event === 'applicationReady') {
                t.assertTrue(true, 'applicationReady fired');
                t.done();
            }
        }
    });
    app.run();
});