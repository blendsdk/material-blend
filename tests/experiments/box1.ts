/// <reference path="../blend/blend.d.ts" />
Blend.Runtime.ready(function() {

    var types = ['layout.hbox', 'layout.vbox'];
    var aligns = [eBoxLayoutAlign.start, eBoxLayoutAlign.center, eBoxLayoutAlign.end];
    var packs = [eBoxLayoutPack.start, eBoxLayoutPack.center, eBoxLayoutPack.end];
    var dFrag: DocumentFragment = document.createDocumentFragment();
    var views: Array<Blend.ui.View> = [];

    Blend.forEach(types, function(ctype: string) {
        Blend.forEach(aligns, function(align: eBoxLayoutAlign) {
            Blend.forEach(packs, function(pack: eBoxLayoutPack) {

                var view = Blend.createComponent<Blend.ui.ContainerView>({
                    width: 150,
                    height: 150,
                    style: {
                        position: 'relative',
                        display: 'inline-block',
                        border: '1px solid black'
                    },
                    ctype: ctype,
                    align: align,
                    pack: pack,
                    items: [
                        { ctype: 'ui.rect', color: 'red', width: 32, height: 32 },
                        { ctype: 'ui.rect', color: 'blue', width: 32, height: 32 },
                        { ctype: 'ui.rect', color: 'orange', width: 32, height: 32 }
                    ]
                });

                var txt = document.createElement('DIV');
                txt.innerHTML = `${ctype} A:${Blend.getEnumValue(eBoxLayoutAlign, align)} P:${Blend.getEnumValue(eBoxLayoutPack, pack)}`;
                dFrag.appendChild(txt);
                dFrag.appendChild(view.getElement().getEl());

                views.push(view);

            });
        });
    });

    var body = wrapEl(document.body);
    body.addCssClass('default', false);
    body.getEl().appendChild(dFrag);
    body.setStyle({ overflow: null });
    (<any>window).views = views;
});

Blend.Runtime.kickStart();
