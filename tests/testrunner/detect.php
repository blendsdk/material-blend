<!DOCTYPE html>
<html>
    <head>
        <title>BlendJS Test Runner</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link id="theme" href="css/default/default.css" rel="stylesheet" type="text/css">
        <style>

            .row {

            }

            .col {
                padding:5px;
                border-bottom: 1px solid #e6e6e6;
                border-right: 1px solid #e6e6e6;
            }

        </style>
    </head>
    <?php

    function createColumns($parts = []) {
        $html = "<div class='grid'>";
        $html .= "<div class='row'>";
        foreach ($parts as $part) {
            $html .= "<div class='col col-lg-{$part} b-hide-on-sm'>Column {$part}</div>";
        }
        $html .= "</div>";
        $html .= "</div>";
        return $html;
    }

    function createGrid() {
        $parts = [
            [1, 11],
            [2, 10],
            [3, 9],
            [4, 8],
            [5, 7],
            [6, 6],
            [7, 5],
            [8, 4],
            [9, 3],
            [10, 2],
            [11, 1],
            [4, 4, 4],
            [3, 3, 3, 3],
            [6, 3, 3]
        ];

        foreach ($parts as $part) {
            echo createColumns($part);
        }
    }
    ?>
    <script src="blend/blend.js" type="text/javascript"></script>
    <!--<script src="js/experiments/exp1.js" type="text/javascript"></script>-->
    <body class="default host">
        <span id="media-info"></span>
        <?php createGrid(); ?>

    </body>
</html>
