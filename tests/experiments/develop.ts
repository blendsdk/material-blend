/// <reference path="../blend/blend.d.ts" />

Blend.Runtime.ready(function() {


    var r = new Blend.material.Rectangle(<RectangleInterface>{
        width: 100,
        height: 100,
        color: '#fff',
        elevation: 4,

    });
    Blend.getElement(document.body).append(r.getElement());
    (<any>window).rect1 = r;

});

Blend.Runtime.kickStart();