<?php

require_once 'Database.php';

class Item extends Database
{
    private $collection;

    public function __construct($config)
    {
        parent::__construct($config);

        $this->collection = $this->db->items;
    }

    public function getItem($data)
    {
        if (isset($data['id'])) {
            return $this->getItemById($data['id']);
        } elseif (isset($data['userId'])) {
            return $this->getItemsByUserId($data['userId']);
        } else {
            return null;
        }
    }

    public function getItemById($id)
    {
        $query = ['_id' => new MongoId($id)];

        $item = $this->collection->findOne($query);

        return $item;
    }

    public function getItemsByUserId($userId)
    {
        $query = ['userId' => $userId];
        $cursor = $this->collection->find($query);
        $items = [];
        foreach ($cursor as $item) {
            $items[] = $item;
        }

        return $items;
    }

    public function postItem(array $body)
    {
        if (!isset($body['value']) || !isset($body['userId'])) {
            return null;
        }

        $item = [
            'value'  => $body['value'],
            'userId' => $body['userId']
        ];
        $this->collection->insert($item);

        return $item;
    }
}
