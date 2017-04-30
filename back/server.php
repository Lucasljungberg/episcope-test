<?php

namespace Server;
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

require_once 'error.php';
require_once 'utils.php';
require_once 'routeHandler.php';
require_once 'routes.php';

$requestUri = parse_url($_SERVER["REQUEST_URI"])["path"];

$route->invoke($requestUri, $_SERVER["REQUEST_METHOD"]);
