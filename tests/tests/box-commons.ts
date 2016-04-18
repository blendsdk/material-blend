/// <reference path="../blend/blend.d.ts" />

var aligns = [eBoxLayoutAlign.start, eBoxLayoutAlign.center, eBoxLayoutAlign.end];
var packs = [eBoxLayoutPack.start, eBoxLayoutPack.center, eBoxLayoutPack.end];

function boxPositionTest(layoutConfig: any, viewsConfig: Array<any>, tops: Array<number>, lefts: Array<number>, widths: Array<number>, heights: Array<number>, stop: boolean = false) {

    var layoutCaption = layoutConfig.ctype + ' align:' + Blend.getEnumValue(eBoxLayoutAlign, layoutConfig.align) +
        ' pack: ' + Blend.getEnumValue(eBoxLayoutPack, layoutConfig.pack);

    var createMessage = function(index: number): string {
        return index + layoutCaption;
    }


    TestApp.defineTest(layoutConfig.ctype + ' ' + layoutCaption, function(t: Blend.testing.TestRunner) {

        var body = wrapEl(document.body);
        body.setHtml('<div id="host"></div>')
            .addCssClass('default', false);

        var boxConfig = Blend.apply({
            width: 400,
            height: 400,
            css: 'b-fitted',
            items:viewsConfig,
            style: {
                'background-color': '#EDEDED'
            }}
            , layoutConfig);

        var box = Blend.createComponent<Blend.ui.ContainerView>(boxConfig);

        var host = wrapEl(document.getElementById('host'));
        host.setStyle({
            position: 'absolute',
            top: 100,
            left: 100,
            width: 400,
            height: 400
        });
        host.append(box.getElement());
        box.performLayout();

        t.delay(function() {

            var bounds: ElementBoundsInterface;
            if (tops !== null) {

                Blend.forEach(box.getItems(), function(view: Blend.ui.View, index: number) {
                    bounds = view.getBounds();
                    t.assertEquals(Math.round(bounds.top), tops[index], 'Top of View ' + createMessage(index) + ' test');
                });
            }
            if (lefts !== null) {
                Blend.forEach(box.getItems(), function(view: Blend.ui.View, index: number) {
                    bounds = view.getBounds();
                    t.assertEquals(Math.round(bounds.left), lefts[index], 'Left of View ' + index + ' test');
                });
            }
            if (widths !== null) {
                Blend.forEach(box.getItems(), function(view: Blend.ui.View, index: number) {
                    bounds = view.getBounds();
                    t.assertEquals(Math.round(<number>bounds.width), widths[index], 'Width of View ' + index + ' test');
                });
            }
            if (heights !== null) {
                Blend.forEach(box.getItems(), function(view: Blend.ui.View, index: number) {
                    bounds = view.getBounds();
                    t.assertEquals(Math.round(<number>bounds.height), heights[index], 'Heigh of View ' + index + ' test');
                });
            }
            if (stop === false) {
                t.done(500);
            }
        },500);
    });
}