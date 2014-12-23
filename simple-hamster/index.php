<?php

const REDIS_QUEUE_NAME_MW_TO_BE  = 'chipmunkjs-queue-mw-to-be';
const REDIS_QUEUE_NAME_BE_TO_MW = 'chipmunkjs-queue-be-to-mw';

$redis = new Redis();

$redis->connect('127.0.0.1', 6379);

do {
    $command = $redis->blpop(REDIS_QUEUE_NAME_MW_TO_BE, 0);
    echo "REQ: " . $command[1] . "\n";

    $redis->rpush(REDIS_QUEUE_NAME_BE_TO_MW, 'hahah');
    echo "RES: \n";
} while (true);
