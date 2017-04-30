<?php

namespace Server;
use Server\RouteHandler;

$route = new RouteHandler();

$route->registerStaticFolder("/front/js");

$route->get("/", function($request, $utils) {
    header("Content-Type: text/html; charset=utf-8");

    // Does not make much sense
    if (isset($request["username"])) {
        if (!$utils->userExists($request["username"])) {
            echo "User {$request['username']} does not exist";
        }
        $_SESSION["username"] = $request["username"];
    }

    echo file_get_contents("front/index.html");
});

$route->post("/logout", function($request) {
    session_destroy();
    exit();
});

$route->preGet(function($req, $uri, $route) {
    if ($route->isStatic($uri)) {
        exit(file_get_contents(substr($uri, 1)));
    }
});

$route->post("/login", function($request, $utils, $error) {
    header("Content-Type: application/json");

    $data = $utils->getDB();
    $user_data = $data["users"];

    if (!(isset($request["username"]) && $utils->userExists($request["username"], $user_data))) {
        $utils->sendError();
        return;
    }

    $_SESSION["username"] = $request["username"];
    $response = [ 
        "username" => $request["username"]
    ];
    if (isset($request["remember"])) {
        $newKey = bin2hex(random_bytes(10));
        $data["authenticated_users"][] = [
            "user" => $request["username"],
            "rem_token" => $newKey
        ];
        $response["rem_token"] = $newKey;
        $utils->writeToDB($data);
    }
    exit(json_encode($response));
});

$route->post("/token_auth", function($request, $utils, $error) {
    if (!isset($request["username"]) || !isset($request["rem_token"])) {
        $error->returnError("Insufficient data", 400);
    }
    $data = $utils->getDB();
    $authentications = $data["authenticated_users"];
    $entry = -1;
    foreach ($authentications as $key => $auth) {
        if ($auth["user"] === $request["username"] && $auth["rem_token"] === $request["rem_token"]) {
            $entry = $key;
            break;
        }
    }
    if ($entry === -1) {
        $error->returnError("Bad credentials", 400);
    }
    $newKey = bin2hex(random_bytes(10));
    $data["authenticated_users"][$entry]["rem_token"] = $newKey;
    $_SESSION["username"] = $request["username"];
    $utils->writeToDB($data);
    header("Content-Type: application/json");
    $response = [
        "rem_token" => $newKey,
        "loggedIn" => true
    ];
    exit(json_encode($response));
});

$route->get("/data", function($request, $utils) {
    header("Content-Type: application/json");
    if (isset($_SESSION["username"])) {
        $username = $_SESSION["username"];
        $menuData = json_decode(file_get_contents("back/data/menu.json"), true);
        $user_data = $utils->getDB()["machines"][$username];
        $menuData["machines"]["options"] = $user_data;
        $data = [
            "data" => $menuData,
            "username" => $username
        ];
        exit(json_encode($data));
    } else {
        $data = [
            "data" => null
        ];        
        exit(json_encode($data));
    }
});
