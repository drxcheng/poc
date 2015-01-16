<?php

require_once 'config.php';

try {
    $m = new MongoClient(); // connect
    $db = $m->selectDB($config['mongodb']['database']);
} catch (MongoConnectionException $e) {
    echo "connecting to MongoDB failed\n";
    exit();
}

$users = $db->users;
$results = $users->find();
foreach ($results as $result) {
    var_dump($result);
}

$id = '54b94b6440a98f8f1fe1f277';
$result = $users->findOne(['_id' => new MongoId($id)]);

var_dump($result);
