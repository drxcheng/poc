<?php

class Database
{
    protected $db;

    public function __construct(array $config)
    {
        try {
            $m = new MongoClient(); // connect
            $this->db = $m->selectDB($config['mongodb']['database']);
        } catch (MongoConnectionException $e) {
            echo "connecting to MongoDB failed\n";
            exit();
        }
    }
}
