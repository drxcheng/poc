<?php

class Database
{
    protected $db;

    public function __construct(array $config)
    {
        $this->db = new \PDO(
            "mysql:host={$config['host']};dbname={$config['name']}",
            $config['user'],
            $config['pass']
        );
        $this->db->exec('SET NAMES utf8');
    }
}