<?php

/**
 * @todo: live long
 */
class Chipmunk
{
    const REQUEST_TIMEOUT = 0;
    const RESPONSE_TIMEOUT = 2;

    private $redis;

    public function __construct($host)
    {
        $this->redis = new Redis();
        $this->redis->connect($host, 6379);
    }

    public function read($queue)
    {
        $command = $this->redis->blpop($queue, self::REQUEST_TIMEOUT);

        return $command;
    }

    public function write($queue, $response)
    {
        $this->redis->rpush($queue, $response);
        $this->redis->expire($queue, self::RESPONSE_TIMEOUT);

        return $this;
    }
}
