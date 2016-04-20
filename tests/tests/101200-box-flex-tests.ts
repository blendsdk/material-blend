/// <reference path="../blend/blend.d.ts" />
/// <reference path="box-commons.ts" />

var flex_hbox: BoxContainerInterface = {
    ctype: 'layout.box',
    boxType: 'hbox',
    align: eBoxLayoutAlign.stretch,
    pack: eBoxLayoutPack.start
}

var flexRect1 = function() { return { ctype: 'ui.rect', flex: 1, color: 'red' } };
var flexRect2 = function() { return { ctype: 'ui.rect', flex: 2, color: 'white' } };
var flexRect3 = function() { return { ctype: 'ui.rect', flex: 1, color: 'blue' } };

boxPositionTest(
    flex_hbox,
    [flexRect1(), flexRect2(), flexRect3()],
    [0, 0, 0],
    [0, 100, 300],
    [100, 200, 100],
    [400, 400, 400]
);


var flex_vbox: BoxContainerInterface = {
    ctype: 'layout.box',
    boxType: 'vbox',
    align: eBoxLayoutAlign.stretch,
    pack: eBoxLayoutPack.start
}

boxPositionTest(
    flex_vbox,
    [flexRect1(), flexRect2(), flexRect3()],
    [0, 100, 300],
    [0, 0, 0],
    [400, 400, 400],
    [100, 200, 100]
);