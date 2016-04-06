/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('Element', function(t: Blend.testing.TestRunner) {

    var el: HTMLElement;

    var noclass = wrapEl(document.createElement('p'));
    t.assertEquals('', noclass.getCssClass(), 'get noclass as string');
    t.assertEquals([], noclass.getCssClass(true), 'get noclass as array');

    el = document.createElement('p');
    el.setAttribute('class', '');
    var emptyClass = wrapEl(el);
    t.assertEquals('', emptyClass.getCssClass(), 'get emptyClass as string');
    t.assertEquals([], emptyClass.getCssClass(true), 'get emptyClass as array');

    el = document.createElement('p');
    el.setAttribute('class', '   ');
    var trimClass = wrapEl(el);
    t.assertEquals('', trimClass.getCssClass(), 'get trimClass as string');
    t.assertEquals([], trimClass.getCssClass(true), 'get trimClass as array');

    el = document.createElement('p');
    el.setAttribute('class', 'a b b-c');
    var abcList = wrapEl(el);
    t.assertEquals(['a', 'b', 'b-c'], abcList.getCssClass(true), 'get abcList');

    t.assertTrue(abcList.hasCssClass('b', false), 'has b with no prefix');
    t.assertFalse(abcList.hasCssClass('b'), 'has b with prefix');
    t.assertTrue(abcList.hasCssClass('c'), 'has c with prefix');

    el = document.createElement('p');
    var withClass = wrapEl(el);
    t.assertEquals(withClass.addCssClass('css1').getCssClass(true), ['b-css1'], 'added one css class');
    t.assertEquals(withClass.addCssClass('css1').getCssClass(true), ['b-css1'], 'added one css class again');
    t.assertEquals(withClass.addCssClass(['css2', 'css3']).getCssClass(true), ['b-css1', 'b-css2', 'b-css3'], 'added array css class');
    t.assertEquals(withClass.addCssClass(['css2', 'css3']).getCssClass(true), ['b-css1', 'b-css2', 'b-css3'], 'added array css class again');
    t.assertEquals(withClass.addCssClass('no-prefix', false).getCssClass(true), ['b-css1', 'b-css2', 'b-css3', 'no-prefix'], 'added one css class no prefix');
    t.assertEquals(withClass.addCssClass('hello-world', false, true).getCssClass(), 'hello-world', 'replaced no prefix');
    t.assertEquals(withClass.addCssClass('hello-world', true, true).getCssClass(), 'b-hello-world', 'replaced with prefix');
    t.assertEquals(withClass.clearCssClass().getCssClass(), '', 'cleared');
    t.done();
});