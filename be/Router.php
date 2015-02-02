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
    public function getResponse($method, $url, $body)
    {
        list($resource, $query) = $this->parseUrl($url);

        switch ($resource) {
            case '/api/poc/user':
                return $this->getUserResponse($method, $query, $body);
                break;

            case '/api/poc/item':
                return $this->getItemResponse($method, $query, $body);
                break;

            default:
                return [
                    'header' => ['header' => ['code' => 400]],
                    'body' => 'invalid resource'
                ];
        }
    }

    private function parseUrl($url)
    {
        $urlParts = parse_url($url);
        $query = [];
        if (isset($urlParts['query'])) {
            parse_str($urlParts['query'], $query);
        }

        return [$urlParts['path'], $query];
    }

    /**
     * @return array
     */
    public function getUserResponse($method, $query, $body)
    {
        $userDataAccess = new User($this->config);

        $method = strtolower($method);
        switch ($method) {
            case 'get':
                $user = $userDataAccess->getUser($query);
                if ($user === null) {
                    $response = [
                        'header' => ['code' => 404],
                        'body' => 'cannot find'
                    ];
                } else {
                    $response = [
                        'header' => ['code' => 200],
                        'body' => $user
                    ];
                }
                break;
            case 'post':
                $user = $userDataAccess->postUser(json_decode($data, true));
                if ($user === null) {
                    $response = [
                        'header' => ['code' => 400],
                        'body' => 'bad request'
                    ];
                } else {
                    $response = [
                        'header' => ['code' => 200],
                        'body' => $user
                    ];
                }
                break;
            default:
                $response = [
                    'header' => ['code' => 400],
                    'body' => 'invalid method'
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
                        'header' => ['code' => 404],
                        'body' => 'cannot find'
                    ];
                } else {
                    $response = [
                        'header' => ['code' => 200],
                        'body' => $item
                    ];
                }
                break;
            case 'post':
                $item = $itemDataAccess->postItem($data);
                if ($item === null) {
                    $response = [
                        'header' => ['code' => 400],
                        'body' => 'bad request'
                    ];
                } else {
                    $response = [
                        'header' => ['code' => 200],
                        'body' => $item
                    ];
                }
                break;
            default:
                $response = [
                    'header' => ['code' => 400],
                    'body' => 'invalid method'
                ];
        }

        return $response;
    }
}
