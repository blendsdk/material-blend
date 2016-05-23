<!DOCTYPE html>
<html>
    <head>
        <title>BlendJS Test Runner</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link id="theme" href="css/default/default.css" rel="stylesheet" type="text/css">
        <script src="blend/support.js"></script>
        <script src="blend/blend.js"></script>
        <style>
            .flex-grid > div {
                background-color: gray;
                padding: 5px;
                color:#fff;
            }

            .flex-grid {
                xmargin-bottom: 10px;
                margin: 10px;
            }
        </style>
    </head>
    <body class="material default">
        <div class="flex-grid">
            <div class="flex-item flex-1-4 flex-1-8 flex-3-12">Item 1</div>
            <div class="flex-item flex-1-4 flex-1-8 flex-3-12">Item 2</div>
            <div class="flex-item flex-1-4 flex-2-8 flex-3-12">Item 3</div>
            <div class="flex-item flex-1-4 flex-4-8 flex-3-12">Item 4</div>
        </div>
        <div class="flex-grid">
            <div class="flex-item flex-2-4 flex-4-8">Item 1</div>
            <div class="flex-item flex-2-4 flex-4-8">Item 2</div>
        </div>
    </body>
</html>
