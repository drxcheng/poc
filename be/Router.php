<?php

require_once 'User.php';
require_once 'Item.php';

/**
 * dumb router
 */
class Router
{
    private $config;

    public function __construct($config)
    {
        $this->config = $config;
    }

    /**
     * @return array
     */
    public function getResponse($method, $resource, $data)
    {
        switch ($resource) {
            case 'user':
                return $this->getUserResponse($method, $data);
                break;

            case 'item':
                return $this->getItemResponse($method, $data);
                break;

            default:
                return [
                    'code' => 400,
                    'message' => 'invalid resource'
                ];
        }
    }

    /**
     * @return array
     */
    public function getUserResponse($method, $data)
    {
        $userDataAccess = new User($this->config);

        $method = strtolower($method);
        switch ($method) {
            case 'get':
                $user = $userDataAccess->getUser($data);
                if ($user === null) {
                    $response = [
                        'code' => 404,
                        'message' => 'cannot find'
                    ];
                } else {
                    $response = [
                        'code' => 200,
                        'data' => $user
                    ];
                }
                break;
            case 'post':
                $user = $userDataAccess->postUser(json_decode($data, true));
                if ($user === null) {
                    $response = [
                        'code' => 400,
                        'message' => 'bad request'
                    ];
                } else {
                    $response = [
                        'code' => 200,
                        'data' => $user
                    ];
                }
                break;
            default:
                $response = [
                    'code' => 400,
                    'message' => 'invalid method'
                ];
        }

        return $response;
    }

    public function getItemResponse($method, $data)
    {
        $itemDataAccess = new Item($this->config);

        $method = strtolower($method);
        switch ($method) {
            case 'get':
                $item = $itemDataAccess->getItem($data);
                if ($item === null) {
                    $response = [
                        'code' => 404,
                        'message' => 'cannot find'
                    ];
                } else {
                    $response = [
                        'code' => 200,
                        'data' => $item
                    ];
                }
                break;
            case 'post':
                $item = $itemDataAccess->postItem($data);
                if ($item === null) {
                    $response = [
                        'code' => 400,
                        'message' => 'bad request'
                    ];
                } else {
                    $response = [
                        'code' => 200,
                        'data' => $item
                    ];
                }
                break;
            default:
                $response = [
                    'code' => 400,
                    'message' => 'invalid method'
                ];
        }

        return $response;
    }
}
