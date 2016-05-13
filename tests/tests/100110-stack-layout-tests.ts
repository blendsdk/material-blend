/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('Stack Layout', function(t: Blend.testing.TestRunner) {

    Blend.Runtime.reset();

    Blend.Runtime.ready(function() {

        var body = Blend.getElement(document.body);
        body.setHtml('<div id="host"></div>')
            .addCssClass('default', false);

        var fc = new Blend.container.Stack({
            css: 'b-fitted',
            activeView: 'rect3',
            controller: function(view: Blend.ui.View, eventName: string) {
                var me: Blend.container.Stack = this;
                if (eventName === 'activeViewChanged') {
                    t.assertEquals(me.getActiveView().getReference(), 'rect1', 'rect1 ' + eventName);
                }
            },
            items: [
                <UIViewInterface>{
                    ctype: 'ui.rect',
                    reference: 'rect1',
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

        var host = Blend.getElement(document.getElementById('host'));
        host.setStyle({
            position: 'absolute',
            top: 100,
            left: 100,
            width: 400,
            height: 400
        });
        host.append(fc.getElement());
        fc.performLayout();
        fc.setActiveView(0);
        t.done(1000);
    });
    Blend.Runtime.kickStart();
});