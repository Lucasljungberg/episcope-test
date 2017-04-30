<?php
namespace Server;

class Utils {
    public $dbPath = "back/data/pdb.json";
    public $logPath = ".log";

    public function userExists ($user) {
        $userlist = $this->getDB()["users"];
        foreach ($userlist as $userObj) {
            if ($user === $userObj["username"]) return true;
        }
        return false;
    }

    public function log(array $obj) {
        file_put_contents($this->logPath, json_encode($obj));
    }

    public function getDB() {
        return json_decode(file_get_contents($this->dbPath), true);
    }

    public function writeToDB(array $obj) {
        file_put_contents("back/data/pdb.json", json_encode($obj));
    }
}
