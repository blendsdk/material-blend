/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('Fit Layout', function(t: Blend.testing.TestRunner) {

    Blend.Runtime.reset();

    Blend.Runtime.ready(function() {

        var body = wrapEl(document.body);
        body.setHtml('<div id="host"></div>')
            .addCssClass('default', false);

        var fc = new Blend.container.Fit({
            css: 'b-fitted',
            controller: function(view: Blend.ui.View, eventName: string) {
                var me = this;
                if (view.getReference() === 'rect1' && eventName === 'layoutCycleFinished') {
                    var bounds = view.getBounds();
                    t.assertEquals(bounds.width, 420, 'rect fitted width ok');
                    t.assertEquals(bounds.height, 400, 'rect fitted height ok');
                    t.assertEquals(bounds.top, 0, 'top is correct');
                    t.assertEquals(bounds.left, 0, 'left is correct');
                    t.done(1000);
                }
            },
            items: [
                <UIViewInterface>{
                    ctype: 'ui.rect',
                    reference: 'rect1',
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
            width: 420,
            height: 400
        });
        host.append(fc.getElement());
        fc.performLayout();

    });
    Blend.Runtime.kickStart();
});

TestApp.defineTest('Fit Layout', function(t: Blend.testing.TestRunner) {

    Blend.Runtime.reset();

    Blend.Runtime.ready(function() {

        var body = wrapEl(document.body);
        body.setHtml('<div id="host"></div>')
            .addCssClass('default', false);

        var fc = new Blend.container.Fit(<FitContainerInterface>{
            css: 'b-fitted',
            style: {
                'background-color': 'yellow'
            },
            contentPadding: 10,
            items: [
                {
                    ctype: 'ui.rect',
                    border: true,
                    color: 'green',
                    controller: function(view: Blend.ui.View, eventName: string) {
                        var me = this;
                        if (eventName === 'layoutCycleFinished') {
                            var bounds = view.getBounds();
                            t.assertEquals(bounds.width, 280, 'rect fitted width ok');
                            t.assertEquals(bounds.height, 180, 'rect fitted height ok');
                            t.done(1000);
                        }
                    },
                }
            ]
        });

        var host = wrapEl(document.getElementById('host'));
        host.setStyle({
            position: 'absolute',
            top: 100,
            left: 100,
            width: 300,
            height: 200
        });
        host.append(fc.getElement());
        fc.performLayout();

    });
    Blend.Runtime.kickStart();
});
