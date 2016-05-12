<?php

include dirname(__FILE__) . '/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();

$command = $request->get('cmd');

if ($command === 'get-hello-test' && $request->getMethod() === 'GET') {
    $response = new Response('Hello ' . $request->get('name'), 200);
    $response->send();
} else if ($command == 'post-echo-test' && $request->getMethod() === 'POST') {
    $response = new Response(http_build_query($request->request->all()), 200);
    $response->send();
} else {
    $response = new Response('Invalid command' . print_r($request, true), 500);
    $response->send();
}