<?php

include dirname(__FILE__) . '/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();

$command = $request->get('cmd');

if ($command === 'get-echo-test') {
    $response = new Response('Hello ' . $request->get('name'), 200);
    $response->send();
} else {
    $response = new Response('Invalid command', 500);
    $response->send();
}