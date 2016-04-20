/// <reference path="../blend/blend.d.ts" />
/// <reference path="box-commons.ts" />

var fixedRect1 = function() { return { ctype: 'ui.rect', color: 'red' }; };
var fixedRect2 = function() { return { ctype: 'ui.rect', color: 'blue' }; };
var fixedRect3 = function() { return { ctype: 'ui.rect', color: 'orange' }; };

var hbox_tops = [
    [0, 0, 0],
    [150, 150, 150],
    [300, 300, 300]
]

var hbox_lefts = [
    [0, 100, 200],
    [50, 150, 250],
    [100, 200, 300]
]

var hbox_widths = [
    [100, 100, 100],
    [100, 100, 100],
    [100, 100, 100]
]

var hbox_heights = [
    [100, 100, 100],
    [100, 100, 100],
    [100, 100, 100],
];

Blend.forEach(aligns, function(align: eBoxLayoutAlign, align_index: number) {

    Blend.forEach(packs, function(pack: eBoxLayoutPack, pack_index: number) {

        boxPositionTest(
            { ctype: 'layout.box', boxType: 'hbox', align: align, pack: pack },
            [fixedRect1(), fixedRect2(), fixedRect3()],
            hbox_tops[align_index],
            hbox_lefts[pack_index],
            hbox_widths[align_index],
            hbox_heights[pack_index]);
    });
});

Blend.forEach(aligns, function(align: eBoxLayoutAlign, align_index: number) {

    Blend.forEach(packs, function(pack: eBoxLayoutPack, pack_index: number) {

        boxPositionTest(
            { ctype: 'layout.box', boxType: 'hbox', align: eBoxLayoutAlign.stretch, pack: pack },
            [fixedRect1(), fixedRect2(), fixedRect3()],
            [0, 0, 0],
            hbox_lefts[pack_index],
            [100, 100, 100],
            [400, 400, 400]);
    });
});

var vbox_tops = [
    [0, 100, 200],
    [50, 150, 250],
    [100, 200, 300]
]

var vbox_lefts = [
    [0, 0, 0],
    [150, 150, 150],
    [300, 300, 300]
]

var vbox_widths = [
    [100, 100, 100],
    [100, 100, 100],
    [100, 100, 100]
]

var vbox_heights = [
    [100, 100, 100],
    [100, 100, 100],
    [100, 100, 100]
]

Blend.forEach(aligns, function(align: eBoxLayoutAlign, align_index: number) {

    Blend.forEach(packs, function(pack: eBoxLayoutPack, pack_index: number) {

        boxPositionTest(
            { ctype: 'layout.box', boxType: 'vbox', align: align, pack: pack },
            [fixedRect1(), fixedRect2(), fixedRect3()],
            vbox_tops[pack_index],
            vbox_lefts[align_index],
            vbox_widths[align_index],
            vbox_heights[pack_index]);
    });
});


Blend.forEach(aligns, function(align: eBoxLayoutAlign, align_index: number) {

    Blend.forEach(packs, function(pack: eBoxLayoutPack, pack_index: number) {

        boxPositionTest(
            { ctype: 'layout.box', boxType: 'vbox', align: eBoxLayoutAlign.stretch, pack: pack },
            [fixedRect1(), fixedRect2(), fixedRect3()],
            vbox_tops[pack_index],
            [0, 0, 0],
            [400, 400, 400],
            [100, 100, 100]);
    });
});
