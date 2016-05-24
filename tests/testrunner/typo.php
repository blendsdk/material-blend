<!DOCTYPE html>
<html>
    <head>
        <title>BlendJS Test Runner</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link id="theme" href="css/default/default.css" rel="stylesheet" type="text/css">
        <script src="blend/support.js"></script>
        <script src="blend/blend.js"></script>
    </head>
    <body class="material default">
        <div style="margin: 10px">This i normal text</div>
    </body>
    <script>
        var body = Blend.selectElement('body');
        var names = 'h1 h2 h3 h4 h5 h6 address p';
        names.split(' ').forEach(function (t) {
            body.append(Blend.createElement({
                tag: t,
                text: 'This is a ' + t.toUpperCase()
            }));
        });
    </script>
</html>
