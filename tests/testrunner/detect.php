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
        Blend.Runtime.ready(function(){

            console.clear();
            var body = wrapEl(document.body);
            body.setHtml('<div id="host"></div>')
                .addCssClass('default',false);

            var fc = new Blend.container.Fit({
            css:'b-fitted',
            items:[
                {
                ctype:'ui.rect',
                border:true,
                color:'orange'
                }
            ]
            });

            var host =  wrapEl(document.getElementById('host'));
            host.append(fc.getElement());
            fc.performLayout();
            window.fc = fc;

        });
        Blend.Runtime.kickStart();
    </script>
    <body>
    </body>
</html>
