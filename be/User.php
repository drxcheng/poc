<?php

require_once 'Database.php';

class User extends Database
{
    private $collection;

    public function __construct($config)
    {
        parent::__construct($config);

        $this->collection = $this->db->users;
    }

    public function getUser($data)
    {
        if (isset($data['id'])) {
            $query = ['_id' => new MongoId($data['id'])];
        } elseif (isset($data['googleId'])) {
            $query = ['googleId' => $data['googleId']];
        } else {
            return null;
        }

        $user = $this->collection->findOne($query);

        return $user;
    }

    public function postUser(array $body)
    {
        if (!isset($body['name']) || !isset($body['googleId'])) {
            return null;
        }

        $user = [
            'name'     => $body['name'],
            'googleId' => $body['googleId']
        ];
        $this->collection->insert($user);

        return $user;
    }
}
