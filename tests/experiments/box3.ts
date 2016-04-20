/// <reference path="../blend/blend.d.ts" />
Blend.Runtime.ready(function() {

    class SplitContainer extends Blend.container.Box {
        constructor(config: any = {}) {
            super(config);
            var me = this;
            me.addView([
                {
                    ctype: 'ui.rect',
                    color: 'red',
                    flex: 1
                },
                {
                    ctype: 'ui.splitter'
                },
                {
                    ctype: 'ui.rect',
                    color: 'purple',
                    flex: 1
                },
                {
                    ctype: 'ui.splitter'
                },
                {
                    ctype: 'ui.rect',
                    color: 'yellow',
                    flex: 1
                },
            ]);
        }

        protected initialize() {
            var me = this,
                splitter1 = <Blend.splitter.Splitter>me.items[1],
                splitter2 = <Blend.splitter.Splitter>me.items[3];
            splitter1.bindAdjacentViews(me.items[0], me.items[2]);
            splitter2.bindAdjacentViews(me.items[2], me.items[4]);

            me.items.forEach(function(v: Blend.ui.View) {
                v.getElement().selectable(false)
            });

        }
    }

    var cntr = new SplitContainer(<BoxContainerInterface>{
        ctype: 'layout.box',
        width: 800,
        height: 500,
        boxType: 'vbox',
        style: {
            position: 'relative',
            display: 'inline-block',
            border: '1px solid black'
        },
        align: eBoxLayoutAlign.stretch,
        pack: eBoxLayoutPack.center
    });

    var dFrag: DocumentFragment = document.createDocumentFragment();
    dFrag.appendChild(cntr.getElement().getEl());
    (<any>window).cntr = cntr;

    var body = wrapEl(document.body);
    body.addCssClass('default', false);
    body.getEl().appendChild(dFrag);
    body.setStyle({ overflow: 'inherit' });
    cntr.performLayout();
    (<any>window).cntr = cntr;
});

Blend.Runtime.kickStart();
