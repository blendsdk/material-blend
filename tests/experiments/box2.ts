/// <reference path="../blend/blend.d.ts" />
Blend.Runtime.ready(function() {

    var types = ['layout.hbox', 'layout.vbox'];
    var aligns = [eBoxLayoutAlign.start, eBoxLayoutAlign.center, eBoxLayoutAlign.end];
    var packs = [eBoxLayoutPack.start, eBoxLayoutPack.center, eBoxLayoutPack.end];
    var dFrag: DocumentFragment = document.createDocumentFragment();
    var views: Array<Blend.ui.View> = [];

    var cntr = Blend.createComponent<Blend.ui.ContainerView>(<BoxContainerInterface>{
        ctype: 'layout.box',
        width: 500,
        height: 300,
        style: {
            position: 'relative',
            display: 'inline-block',
            border: '1px solid black'
        },
        align: eBoxLayoutAlign.stretch,
        pack: eBoxLayoutPack.center
    });

    dFrag.appendChild(cntr.getElement().getEl());
    (<any>window).cntr = cntr;

    var body = wrapEl(document.body);
    body.addCssClass('default', false);
    body.getEl().appendChild(dFrag);
    body.setStyle({ overflow: 'inherit' });

});

Blend.Runtime.kickStart();
