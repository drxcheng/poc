<?php

require_once 'Database.php';

class Item extends Database
{
    public function getItemById($id)
    {
        $query = "
            SELECT *
            FROM `item`
            WHERE `id` = :id
        ";
        $bind = [
            'id' => $id
        ];
        $stmt = $this->db->prepare($query);
        if (!$stmt->execute($bind)) {
            $error = $stmt->errorInfo();
            throw new \PDOException($error[2]);
        }

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);
            $item = [
                'id'    => $id,
                'value' => $row['value']
            ];

            return $item;
        } else {
            return null;
        }
    }

    public function getItemsByUserId($id)
    {
        $query = "
            SELECT `i`.*
            FROM `item` AS `i`
                INNER JOIN `item_user` AS `iu` ON `iu`.`item_id` = `i`.`id`
            WHERE `iu`.`user_id` = :id
        ";
        $bind = [
            'id' => $id
        ];
        $stmt = $this->db->prepare($query);
        if (!$stmt->execute($bind)) {
            $error = $stmt->errorInfo();
            throw new \PDOException($error[2]);
        }

        $items = [];
        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $items[] = [
                'id'    => $id,
                'value' => $row['value']
            ];
        }

        return $items;
    }

    public function postItem(array $body)
    {
        if (!isset($body['value']) || !isset($body['userId'])) {
            return null;
        }

        $query = "
            INSERT INTO `item` (`value`) VALUES (:value)
        ";
        $bind = [
            'value' => $body['value']
        ];
        $stmt = $this->db->prepare($query);
        if (!$stmt->execute($bind)) {
            $error = $stmt->errorInfo();
            return null;
        }

        $id = $this->db->lastInsertId();

        try {
            $this->insertAssociation($id, $body['userId']);
        } catch (\Exception $e) {
            $this->deleteItem($id);
            return null;
        }

        $item = [
            'id'    => $id,
            'value' => $body['value']
        ];

        return $item;
    }

    private function insertAssociation($itemId, $userId)
    {
        $query = "
            INSERT INTO `item_user` (`item_id`, `user_id`) VALUES (:itemId, :userId)
        ";
        $bind = [
            'itemId' => $itemId,
            'userId' => $userId
        ];
        $stmt = $this->db->prepare($query);
        if (!$stmt->execute($bind)) {
            $error = $stmt->errorInfo();
            throw new \PDOException($error[2]);
        }
    }

    private function deleteItem($itemId)
    {
        $query = "
            DELETE
            FROM `item`
            WHERE `id` = :id
        ";
        $bind = [
            'id' => $itemId
        ];
        $stmt = $this->db->prepare($query);
        if (!$stmt->execute($bind)) {
            $error = $stmt->errorInfo();
            throw new \PDOException($error[2]);
        }
    }
}
