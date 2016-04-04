<?php

function getTestFiles() {
    $result = array();
    $files = glob(__DIR__ . '/js/tests/*.js');
    foreach ($files as $file) {
        $script = str_replace(__DIR__ . '/', '', $file);
        $result[] = "<script src=\"$script\" type=\"text/javascript\"></script>";
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
        <style>
            tr.fail td {
                background-color: #F78181 !important;
            }

            pre, .log, tr td {
                font-size: 0.8em !important;
            }
        </style>
    </head>
    <body>
        <div id="log"></div>
        <script src="blend/blend.js" type="text/javascript"></script>
        <script src="js/src/ConsoleLogger.js" type="text/javascript"></script>
        <script src="js/src/TestFramework.js" type="text/javascript"></script>
        <script>var TestApp = new Blend.testing.TestRunner(new Blend.testing.ConsoleLogger());</script>
        <?php echo getTestFiles(); ?>
        <script>TestApp.run();</script>
    </body>
</html>
