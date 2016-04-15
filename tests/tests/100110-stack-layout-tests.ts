/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('Stack Layout', function(t: Blend.testing.TestRunner) {

    Blend.Runtime.reset();

    Blend.Runtime.ready(function() {

        var body = wrapEl(document.body);
        body.setHtml('<div id="host"></div>')
            .addCssClass('default', false);

        var fc = new Blend.container.Stack({
            css: 'b-fitted',
            activeView: 'rect2',
            controller: function(view: Blend.ui.View, eventName: string) {
                var me: Blend.container.Stack = this;
                if (eventName === 'activeViewChanged') {
                    t.assertEquals(view.getReference(), 'rect2', 'correct active view');
                    t.done();
                }
                console.log(view, eventName);
            },
            items: [
                <UIViewInterface>{
                    ctype: 'ui.rect',
                    reference: 'rect2',
                    border: true,
                    color: 'red'
                },
                <UIViewInterface>{
                    ctype: 'ui.rect',
                    reference: 'rect2',
                    border: true,
                    color: 'blue'
                },
                <UIViewInterface>{
                    ctype: 'ui.rect',
                    reference: 'rect3',
                    border: true,
                    color: 'orange'
                }
            ]
        });

        var host = wrapEl(document.getElementById('host'));
        host.setStyle({
            position: 'absolute',
            top: 100,
            left: 100,
            width: 400,
            height: 400
        });
        host.append(fc.getElement());
        fc.performLayout();

    });
    Blend.Runtime.kickStart();
});