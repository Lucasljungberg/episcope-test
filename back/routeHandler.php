<?php
namespace Server;

use Server\Error;
use Server\Utils;

class RouteHandler {
    private $getRoutes = [];
    private $postRoutes = [];

    private $preGetActions = [];

    private $staticFolders = [];

    /*
     * Utility classes
     */
    protected $error;
    protected $utils;

    function __construct() {
        $this->error = new Error();
        $this->utils = new Utils();
    }

    public function get($uri, $handler) {
        $this->getRoutes[$uri] = $handler;
    }

    public function preGet($handler) {
        $this->preGetActions[] = $handler;
    }

    public function post($uri, $handler) {
        $this->postRoutes[$uri] = $handler;
    }

    private function pathExists($uri) {
        if (array_key_exists($uri, $this->getRoutes)) return true;
        else if (array_key_exists($uri, $this->postRoutes)) return true;
        return false;
    }

    public function registerStaticFolder($uri) {
        $this->staticFolders[] = $uri;
    }

    public function isStatic($uri) {
        foreach ($this->staticFolders as $folder) {
            if (strpos($uri, $folder) !== false) return true;
        }
        return false;
    }

    public function invoke($uri, $method) {
        foreach ($this->preGetActions as $handler => $value) {
            $this->preGetActions[$handler]($_GET, $uri, $this);
        }
        if (!$this->pathExists($uri)) {
            http_response_code(404);
            header("Content-Type: application/json");
            $response = [
                "message" => "The page you were looking for was not found: $uri",
                "data" => $_SERVER,
                "uri" => $uri,
            ];
            echo json_encode($response);
            exit();
        }
        if      ($method === "GET") $this->getRoutes[$uri]($_GET, $this->utils, $this->error);
        else if ($method === "POST") $this->postRoutes[$uri]($_POST, $this->utils, $this->error);
    }
}
