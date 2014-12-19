<?php

require_once 'config.php';
require_once 'User.php';
require_once 'Item.php';

//dumb route
if (isset($_REQUEST['resource']) && $_REQUEST['resource'] === 'user') {
    $userDA = new User($config);

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_REQUEST['id'])) {
        $user = $userDA->getUserById($_REQUEST['id']);

        if ($user === null) {
            header('HTTP/1.0 404');
        } else {
            echo json_encode($user);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_REQUEST['googleId'])) {
        $user = $userDA->getUserByGoogleId($_REQUEST['googleId']);

        if ($user === null) {
            header('HTTP/1.0 404');
        } else {
            echo json_encode($user);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $body = file_get_contents('php://input');
        $bodyJson = json_decode($body, true);
        $user = $userDA->postUser($bodyJson);

        if ($user === null) {
            header('HTTP/1.0 400');
        } else {
            echo json_encode($user);
        }
    } else {
        header('HTTP/1.0 400');
    }
} elseif (isset($_REQUEST['resource']) && $_REQUEST['resource'] === 'item') {
    $itemDA = new Item($config);

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_REQUEST['id'])) {
        $item = $itemDA->getItemById($_REQUEST['id']);

        if ($item === null) {
            header('HTTP/1.0 404');
        } else {
            echo json_encode($item);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_REQUEST['userId'])) {
        $items = $itemDA->getItemsByUserId($_REQUEST['userId']);

        echo json_encode($items);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $body = file_get_contents('php://input');
        $bodyJson = json_decode($body, true);
        $item = $itemDA->postItem($bodyJson);

        if ($item === null) {
            header('HTTP/1.0 400');
        } else {
            echo json_encode($item);
        }
    } else {
        header('HTTP/1.0 400');
    }
} else {
    header('HTTP/1.0 400');
}
