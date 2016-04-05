/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('Runtime', function(t: Blend.testing.TestRunner) {
    var kickstarted = false;
    Blend.Runtime.ready(function(){
        kickstarted = true;
    });
    Blend.Runtime.kickStart();
    t.delay(function(){
        t.assertTrue(kickstarted,'ready works');
        t.done();
    });
});