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
            .default .grid {
                background-color: burlywood;
                margin-bottom: 10px;
            }

            .default .grid .cell {
                background-color: lightgrey;
            }

            .default .grid5 {
                background-color: chocolate !important;
            }
        </style>
    </head>
    <body class="material default">
    </body>
    <script>
        var body = Blend.selectElement('body');
        var gindex = 1;
        var createGrid = function (columns) {
            var cp = new Blend.dom.ElementConfigBuilder();
            cp.addCSS(['grid', 'grid' + gindex]);
            var index = 1;
            columns.forEach(function (w) {
                cp.addChild({
                    cls: ['cell cell-' + w],
                    text: 'Cell ' + w
                });
                index++;
            });
            body.append(Blend.createElement(cp));
            gindex++;
        }
        createGrid([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        createGrid([2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        createGrid([3, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        createGrid([4, 1, 1, 1, 1, 1, 1, 1, 1]);
        createGrid([5, 1, 1, 1, 1, 1, 1, 1]);
        createGrid([6, 1, 1, 1, 1, 1, 1]);
        createGrid([7, 1, 1, 1, 1, 1]);
        createGrid([8, 1, 1, 1, 1]);
        createGrid([9, 1, 1, 1]);
        createGrid([10, 1, 1]);
        createGrid([11, 1]);
        createGrid([12]);

        Blend.selectElement('.grid5').addCssClass('grid-no-spacing');
    </script>
</html>
