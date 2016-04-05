<!DOCTYPE html>
<html>
    <head>
        <title>BlendJS Test Runner</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link id="theme" href="css/default/default.css" rel="stylesheet" type="text/css">
        <style>
            tr.fail td {
                background-color: #F78181 !important;
            }

            pre, .log, tr td {
                font-size: 0.8em !important;
            }
        </style>
    </head>
    <script src="blend/blend.js" type="text/javascript"></script>
    <script>
        Blend.Runtime.ready(function(){
            var log = document.getElementById('log');
            log.innerHTML = Blend.Runtime.detectIE() + ' with kickstart!';
        });
        Blend.Runtime.kickStart();
    </script>
    <body>
        <p id="log"></p>
    </body>
</html>
