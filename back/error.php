<?php
namespace Server;

class Error {
    public static function returnError(string $message, int $httpCode) {
        http_response_code($httpCode);
        $response = [
            "message" => $message
        ];
        exit($response);
    }
}
