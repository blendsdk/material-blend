<?php

include dirname(__FILE__) . '/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\File\UploadedFile;

$view = <<<EOT
<!DOCTYPE html>
<html>
    <head>
        <title>BlendJS Test Runner</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link id="theme" href="css/default/default.css" rel="stylesheet" type="text/css">
        <script src="blend/support.js"></script>
        <script src="blend/blend.js"></script>
        <script src="js/experiments/upload.js"></script>
    </head>
    <body class="default">
    <form>
        <input type="file" multiple name="myFiles" id="myFiles"/>
        <span id="progressLabel"/>
    </form>
    <button type="button" onclick="startUpload()">Start Upload</button>
    </body>
</html>
EOT;

$request = Request::createFromGlobals();
if ($request->get('cmd') === 'upload') {
    foreach ($request->files as $file) {
        $file->move("c:/temp/uploads", $file->getClientOriginalName());
    }
    var_dump($request->files);
} else {
    echo $view;
}
?>
