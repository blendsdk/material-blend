TestApp.defineTest("Runtime", function(t: Blend.testing.TestRunner) {
    var kickstarted = false;
    Blend.Runtime.reset();
    Blend.Runtime.ready(function() {
        kickstarted = true;
        t.assertTrue(kickstarted, "ready works");
        t.done();
    });
    Blend.Runtime.kickStart();
});