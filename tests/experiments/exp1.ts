/// <reference path="../blend/blend.d.ts" />

Blend.Runtime.ready(function() {
    var bodyEl = wrapEl(document.body);
    bodyEl.setHtml('Hello World');
}).kickStart();