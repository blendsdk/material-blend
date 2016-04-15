<!DOCTYPE html>
<html>
    <head>
        <title>BlendJS Test Runner</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link id="theme" href="css/default/default.css" rel="stylesheet" type="text/css">
        <style>
            #host {
                position:absolute;
                top:100px;
                left:100px;
                width:400px;
                height:400px;
                background-color:#ededed;
            }
        </style>
    </head>
    <script src="blend/blend.js" type="text/javascript"></script>
    <script>
        Blend.DEBUG = true;
    Blend.Runtime.ready(function() {

        var body = wrapEl(document.body);
        body.setHtml('<div id="host"></div>')
            .addCssClass('default', false);

        var fc = new Blend.container.Stack({
            css: 'b-fitted',
            reference:'stack1',
            controller: function(view, eventName) {
                var me = this;
                console.log(view.getReference(), view, eventName);
            },
            items: [
                {
                    ctype: 'ui.rect',
                    reference: 'rect1',
                    border: true,
                    color: 'red'
                },
                {
                    ctype: 'ui.rect',
                    reference: 'rect2',
                    border: true,
                    color: 'blue'
                },
                {
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
        window.fc = fc;

    });
    Blend.Runtime.kickStart();
    </script>
    <body>
    </body>
</html>
