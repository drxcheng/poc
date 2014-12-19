<?php

require_once 'Database.php';

class User extends Database
{
    public function getUserById($id)
    {
        $query = "
            SELECT *
            FROM `user`
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

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (empty($row)) {
            $user = null;
        } else {
            $user = [
                'id'       => $id,
                'googleId' => $row['google_id'],
                'name'     => $row['name']
            ];
        }

        return $user;
    }

    public function getUserByGoogleId($id)
    {
        $query = "
            SELECT *
            FROM `user`
            WHERE `google_id` = :id
        ";
        $bind = [
            'id' => $id
        ];
        $stmt = $this->db->prepare($query);
        if (!$stmt->execute($bind)) {
            $error = $stmt->errorInfo();
            throw new \PDOException($error[2]);
        }

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (empty($row)) {
            $user = null;
        } else {
            $user = [
                'id'       => (int) $row['id'],
                'googleId' => $id,
                'name'     => $row['name']
            ];
        }

        return $user;
    }

    public function postUser(array $body)
    {
        if (!isset($body['name']) || !isset($body['googleId'])) {
            return null;
        }

        $query = "
            INSERT INTO `user` (`name`, `google_id`) VALUES (:name, :googleId)
        ";
        $bind = [
            'name'     => $body['name'],
            'googleId' => $body['googleId']
        ];
        $stmt = $this->db->prepare($query);
        if (!$stmt->execute($bind)) {
            $error = $stmt->errorInfo();
            return null;
        }

        $id = $this->db->lastInsertId();

        $user = [
            'id'       => $id,
            'googleId' => $body['googleId'],
            'name'     => $body['name']
        ];

        return $user;
    }
}
