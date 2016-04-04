/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest("sanity tests", function(t: Blend.testing.TestRunner) {
    t.assertTrue(true, "checking sanity");
    t.assertFalse(true, "checking sanity");
    t.done();
});

