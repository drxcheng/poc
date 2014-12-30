<?php

require_once('config.php');

const REDIS_QUEUE_NAME_LISTEN  = 'poc-mw-to-be';

$redis = new Redis();

$redis->connect('127.0.0.1', 6379);

do {
    $command = $redis->blpop(REDIS_QUEUE_NAME_LISTEN, 0);
    echo "REQ: " . $command[1] . "\n";
    list($method, $resource, $data, $responseQueue) = extractCommand($command[1]);
    $response = getResponse($method, $resource, $data);

    $redis->rpush($responseQueue, $response);
    echo "RES: \n";
} while (true);

function extractCommand($commandline)
{
    $command = json_decode($commandline, true);
    if (empty($command)
        || !isset($command['method'])
        || !isset($command['resource'])
        || !isset($command['response'])) {
        return null;
    }

    return [
        $command['method'],
        $command['resource'],
        $command['data'],
        $command['response']
    ];
}

function getResponse($method, $resource, $data)
{
    if ($method === null || $resource === null) {
        $response = '400';
    } elseif ($method === 'GET' && $resource === 'user') {
        sleep(3);
        $params = [
            'resource' => 'user',
            'id' => $data
        ];
        $response = callGetBE('', $params);
    } elseif ($method === 'GET' && $resource === 'item') {
        sleep(5);
        $params = [
            'resource' => 'item',
            'userId' => $data
        ];
        $response = callGetBE('', $params);
    } else {
        $response = '400';
    }

    return $response;
}

function callGetBE($resource, $params)
{
    global $config;

    $ch = curl_init();
    $url = $config['backend'] . $resource . '?' . http_build_query($params);

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return "$status:$response";
}
