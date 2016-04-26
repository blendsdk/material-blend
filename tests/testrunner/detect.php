<!DOCTYPE html>
<html>
    <head>
        <title>BlendJS Test Runner</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link id="theme" href="css/default/default.css" rel="stylesheet" type="text/css">
        <style>
            .host {
                position:absolute;
                top:100px;
                left:100px;
                width:400px;
                height:400px;
                background-color:#ededed;
                border:1px solid gray;
            }

            .row {
                background-color:orange;
            }

            div {
                border:1px dotted gray;
            }
        </style>
    </head>
    <script src="blend/blend.js" type="text/javascript"></script>
    <!--<script src="js/experiments/exp1.js" type="text/javascript"></script>-->
    <body class="default">
        <div class="row">
            <div class="col-lg-6 col-md-4 col-sm-12">Side</div>
            <div class="col-lg-6 col-md-4 col-sm-12">Side</div>
            <div class="col-lg-6 col-md-4 col-sm-12">Side</div>
            <div class="col-lg-6 col-md-12 col-sm-12">Side</div>
        </div>
    </body>
</html>
