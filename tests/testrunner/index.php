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
    <script src="js/testapp/ConsoleLogger.js" type="text/javascript"></script>
    <script src="js/testapp/TestFramework.js" type="text/javascript"></script>
    <script>var TestApp = new Blend.testing.TestRunner(new Blend.testing.ConsoleLogger());</script>
    <?php echo getTestFiles(); ?>
    <script>TestApp.run();</script>
    <body>
    </body>
</html>
