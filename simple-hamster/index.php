<?php

require_once('config.php');

const REDIS_QUEUE_NAME_MW_TO_BE  = 'chipmunkjs-queue-mw-to-be';
const REDIS_QUEUE_NAME_BE_TO_MW = 'chipmunkjs-queue-be-to-mw';

$redis = new Redis();

$redis->connect('127.0.0.1', 6379);

do {
    $command = $redis->blpop(REDIS_QUEUE_NAME_MW_TO_BE, 0);
    echo "REQ: " . $command[1] . "\n";

    list($method, $resource, $arguments) = extractCommand($command[1]);
    $response = getResponse($method, $resource, $arguments);

    $redis->rpush(REDIS_QUEUE_NAME_BE_TO_MW, $response);
    echo "RES: \n";
} while (true);

function extractCommand($commandline)
{
    $commandArray = explode(' ', $commandline);
    if (count($commandArray) < 2) {
        return null;
    }

    $method = $commandArray[0];
    $resource = $commandArray[1];
    $arguments = [];

    $i = 2;
    while ($i < count($commandArray)) {
        $arguments[] = $commandArray[$i];
        ++$i;
    }

    return [
        $method,
        $resource,
        $arguments
    ];
}

function getResponse($method, $resource, $arguments)
{
    if ($method === null || $resource === null) {
        $response = '400';
    } elseif ($method === 'GET' && $resource === 'user') {
        sleep(3);
        $params = [
            'resource' => 'user',
            'id' => $arguments[0]
        ];
        $response = callGetBE('', $params);
    } elseif ($method === 'GET' && $resource === 'item') {
        sleep(5);
        $params = [
            'resource' => 'item',
            'userId' => $arguments[0]
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
