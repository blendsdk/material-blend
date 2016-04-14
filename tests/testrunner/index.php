<?php

function getTestFiles() {
    $result = array();
    $files = glob(__DIR__ . '/js/tests/*.js');
    foreach ($files as $index => $file) {
        $files[$index] = str_replace(__DIR__ . '/', '', $file);
    }
    if(isset($_GET['tests'])) {
        $files = explode(',',$_GET['tests']);
        foreach ($files as $index => $file) {
            $files[$index] = "js/tests/{$file}.js";
        }
    }
    foreach ($files as $file) {
        $result[] = "<script src=\"$file\" type=\"text/javascript\"></script>";
    }
    return implode("\n", $result) . "\n";
}
?>
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

            pre {
                font-size: 12px !important;
            }

            .log, tr td {
                font-size: 0.8em !important;
            }

            .status {
                margin:10px;
            }

            .status span {
                padding:10px;
                margin-right:10px;
            }

            .status .total {
                background-color:blue;
                color:#FFF;
            }

            .status .pass {
                background-color:green;
                color:#FFF;
            }

            .status .fail {
                background-color:red;
                color:#FFF;
            }


        </style>
    </head>
    <script src="blend/blend.js" type="text/javascript"></script>
    <script>Blend.DEBUG = true;</script>
    <script src="js/testapp/ConsoleLogger.js" type="text/javascript"></script>
    <script src="js/testapp/TestFramework.js" type="text/javascript"></script>
    <script>var TestApp = new Blend.testing.TestRunner(new Blend.testing.ConsoleLogger());</script>
    <?php echo getTestFiles(); ?>
    <script>TestApp.run();</script>
    <body>
    </body>
</html>
