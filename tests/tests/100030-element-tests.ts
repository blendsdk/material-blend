TestApp.defineTest('Element', function(t: Blend.testing.TestRunner) {

    var el: HTMLElement;

    var noclass = Blend.getElement(document.createElement('p'));
    t.assertEquals(null, noclass.getCssClass(), 'get noclass as string');
    t.assertEquals([], noclass.getCssClass(true), 'get noclass as array');

    el = document.createElement('p');
    el.setAttribute('class', '');
    var emptyClass = Blend.getElement(el);
    t.assertEquals(null, emptyClass.getCssClass(), 'get emptyClass as string');
    t.assertEquals([], emptyClass.getCssClass(true), 'get emptyClass as array');

    el = document.createElement('p');
    el.setAttribute('class', '   ');
    var trimClass = Blend.getElement(el);
    t.assertEquals(null, trimClass.getCssClass(), 'get trimClass as string');
    t.assertEquals([], trimClass.getCssClass(true), 'get trimClass as array');

    el = document.createElement('p');
    el.setAttribute('class', 'a b b-c');
    var abcList = Blend.getElement(el);
    t.assertEquals(abcList.getCssClass(true), ['a', 'b', 'b-c'], 'get abcList');

    t.assertTrue(abcList.hasCssClass('b'), 'has b with no prefix');
    t.assertFalse(abcList.hasCssClass('b-b'), 'has b with prefix');
    t.assertTrue(abcList.hasCssClass('b-c'), 'has c with prefix');

    el = document.createElement('p');
    var withClass = Blend.getElement(el);
    t.assertEquals(withClass.addCssClass('b-css1').getCssClass(true), ['b-css1'], 'added one css class');
    t.assertEquals(withClass.addCssClass('b-css1').getCssClass(true), ['b-css1'], 'added one css class again');
    t.assertEquals(withClass.addCssClass(['b-css2', 'b-css3']).getCssClass(true), ['b-css1', 'b-css2', 'b-css3'], 'added array css class');
    t.assertEquals(withClass.addCssClass(['b-css2', 'b-css3']).getCssClass(true), ['b-css1', 'b-css2', 'b-css3'], 'added array css class again');
    t.assertEquals(withClass.addCssClass('no-prefix').getCssClass(true), ['b-css1', 'b-css2', 'b-css3', 'no-prefix'], 'added one css class no prefix');
    t.assertEquals(withClass.addCssClass('hello-world', true).getCssClass(), 'hello-world', 'replaced no prefix');
    t.assertEquals(withClass.addCssClass('b-hello-world', true).getCssClass(), 'b-hello-world', 'replaced with prefix');
    t.assertEquals(withClass.clearCssClass().getCssClass(), null, 'cleared');

    t.done();
});

TestApp.defineTest('Element Srtyle', function(t: Blend.testing.TestRunner) {

    Blend.Runtime.reset();
    Blend.Runtime.ready(function() {

        var p = document.createElement('p');
        document.body.appendChild(p);
        var el = Blend.getElement(p);

        t.assertEquals(el.setStyle({ width: 100, position: 'absolute' }).getStyle('width'), { width: 100 }, 'set and get style');

        t.done();
    });
    Blend.Runtime.kickStart();

});

TestApp.defineTest('Element Create Element', function(t: Blend.testing.TestRunner) {
    Blend.Runtime.reset();
    Blend.Runtime.ready(function() {

        var e1 = Blend.createElement({}).getEl();
        document.body.appendChild(e1);
        t.assertEquals(e1.outerHTML, '<div></div>', 'div created');
        ////////////////////////////////////////////////

        var e2 = Blend.createElement({
            style: {
                'background-color': 'red'
            }
        }).getEl();
        document.body.appendChild(e2);
        t.assertTrue(e2.outerHTML.indexOf('background-color') !== -1, 'style set');
        ////////////////////////////////////////////////

        var e3 = Blend.createElement({
            cls: ['c1']
        }).getEl();
        document.body.appendChild(e3);
        t.assertTrue(e3.outerHTML.indexOf('c1') !== -1, 'cls set');
        ////////////////////////////////////////////////

        var e4 = Blend.createElement({
            children: [
                {
                    tag: 'span'
                }
            ]
        }).getEl();
        document.body.appendChild(e4);
        t.assertEquals(e4.outerHTML, '<div><span></span></div>', 'child added');

        t.done();

    });

    Blend.Runtime.kickStart();

});

TestApp.defineTest('Element Selector', function(t: Blend.testing.TestRunner) {

    var body = Blend.getElement(document.body);
    t.assertExists(body, 'Blend.getElement by Element');

    body.clearElement();
    body.setHtml('<p id="myp">1234</p><p>123</p>');
    t.assertExists(Blend.getElement('myp'), 'Blend.getElement by ID')

    t.assertEquals(2, Blend.selectElements('p').length, 'select P (2x)');
    t.assertExists(Blend.selectElement('#myp'), 'Blend.selectElement');

    t.done();

});