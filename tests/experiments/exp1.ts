/// <reference path="../blend/blend.d.ts" />

Blend.Runtime.ready(function() {

    var p = new Promise(function(resolve: Function, reject: Function) {
        setTimeout(function() {
            resolve('Promised to say Hello World');
        }, 5000);
    });

    p.then(function(msg: string) {
        var bodyEl = wrapEl(document.body);
        bodyEl.setHtml(msg);
    }, null);

}).kickStart();