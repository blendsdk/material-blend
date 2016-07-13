TestApp.defineTest("Box Container Rverse Check", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var boxN = new Blend.container.HorizontalBox({
    });

    var boxF = new Blend.container.HorizontalBox({
        revsrse: false
    });

    var boxT = new Blend.container.HorizontalBox({
        reverse: true
    });

    bodyEl.append(boxN.getElement());
    bodyEl.append(boxF.getElement());
    bodyEl.append(boxT.getElement());
    var boxes = [boxN, boxF, boxT];
    boxes.forEach(function (box: Blend.container.Box) {
        box.doInitialize();
        box.performLayout();
    });

    var elements = Blend.selectElements(".mb-box-cntr-body");
    t.assertEquals(elements.length, 3, "correct body count");
    t.assertTrue(elements[0].hasCssClass("mb-box-horizontal"), "box horizontal 1");
    t.assertTrue(elements[1].hasCssClass("mb-box-horizontal"), "box horizontal 2");
    t.assertTrue(elements[2].hasCssClass("mb-box-horizontal-reverse"), "box reverse");

    t.done();

});

TestApp.defineTest("Box Container Wrap Check", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var box = new Blend.container.HorizontalBox({
    });

    var boxNo = new Blend.container.HorizontalBox({
        wrap: Blend.eBoxWrap.no
    });

    var boxYes = new Blend.container.HorizontalBox({
        wrap: Blend.eBoxWrap.yes
    });

    var boxRev = new Blend.container.HorizontalBox({
        wrap: Blend.eBoxWrap.reverse
    });

    var boxes = [box, boxNo, boxYes, boxRev];
    boxes.forEach(function (box: Blend.container.Box) {
        bodyEl.append(box.getElement());
        box.doInitialize();
        box.performLayout();
    });

    var elements = Blend.selectElements(".mb-box-cntr-body");
    t.assertEquals(elements.length, 4, "correct body count");

    t.assertTrue(elements[0].hasCssClass("mb-box-wrap-no"), "correct wrap no");
    t.assertTrue(elements[1].hasCssClass("mb-box-wrap-no"), "correct wrap no");
    t.assertTrue(elements[2].hasCssClass("mb-box-wrap-yes"), "correct wrap yes");
    t.assertTrue(elements[3].hasCssClass("mb-box-wrap-reverse"), "correct wrap reverse");

    t.done();

});

TestApp.defineTest("Box Container Pack Check", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var box = new Blend.container.HorizontalBox({
    });

    var boxStart = new Blend.container.HorizontalBox({
        pack: Blend.eBoxPack.start
    });

    var boxCenter = new Blend.container.HorizontalBox({
        pack: Blend.eBoxPack.center
    });

    var boxEnd = new Blend.container.HorizontalBox({
        pack: Blend.eBoxPack.end
    });

    var boxSpaceBetween = new Blend.container.HorizontalBox({
        pack: Blend.eBoxPack.spaceBetween
    });

    var boxSpaceAround = new Blend.container.HorizontalBox({
        pack: Blend.eBoxPack.spaceAround
    });

    var boxes = [box, boxStart, boxCenter, boxEnd, boxSpaceBetween, boxSpaceAround];
    boxes.forEach(function (box: Blend.container.Box) {
        bodyEl.append(box.getElement());
        box.doInitialize();
        box.performLayout();
    });

    var elements = Blend.selectElements(".mb-box-cntr-body");
    t.assertEquals(elements.length, 6, "correct body count");

    t.assertTrue(elements[0].hasCssClass("mb-box-pack-start"), "correct pack start");
    t.assertTrue(elements[1].hasCssClass("mb-box-pack-start"), "correct pack start");
    t.assertTrue(elements[2].hasCssClass("mb-box-pack-center"), "correct pack center");
    t.assertTrue(elements[3].hasCssClass("mb-box-pack-end"), "correct pack end");
    t.assertTrue(elements[4].hasCssClass("mb-box-pack-spacebetween"), "correct pack space between");
    t.assertTrue(elements[5].hasCssClass("mb-box-pack-spacearound"), "correct pack space around");

    t.done();

});


TestApp.defineTest("Box Container Align Check", function (t: Blend.testing.TestRunner) {

    var bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var box = new Blend.container.HorizontalBox({
    });

    var boxStart = new Blend.container.HorizontalBox({
        align: Blend.eBoxAlign.start
    });

    var boxCenter = new Blend.container.HorizontalBox({
        align: Blend.eBoxAlign.center
    });

    var boxEnd = new Blend.container.HorizontalBox({
        align: Blend.eBoxAlign.end
    });

    var boxStretch = new Blend.container.HorizontalBox({
        align: Blend.eBoxAlign.stretch
    });

    var boxBaseline = new Blend.container.HorizontalBox({
        align: Blend.eBoxAlign.baseline
    });

    var boxes = [box, boxStart, boxCenter, boxEnd, boxStretch, boxBaseline];
    boxes.forEach(function (box: Blend.container.Box) {
        bodyEl.append(box.getElement());
        box.doInitialize();
        box.performLayout();
    });

    var elements = Blend.selectElements(".mb-box-cntr-body");
    t.assertEquals(elements.length, 6, "correct body count");

    t.assertTrue(elements[0].hasCssClass("mb-box-align-start"), "correct align start");
    t.assertTrue(elements[1].hasCssClass("mb-box-align-start"), "correct align start");
    t.assertTrue(elements[2].hasCssClass("mb-box-align-center"), "correct align center");
    t.assertTrue(elements[3].hasCssClass("mb-box-align-end"), "correct align end");
    t.assertTrue(elements[4].hasCssClass("mb-box-align-stretch"), "correct align stretch");
    t.assertTrue(elements[5].hasCssClass("mb-box-align-baseline"), "correct align baseline");

    t.done();

});



