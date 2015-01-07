<?php

/**
 * @todo: live long
 */
class Chipmunk
{
    const TIMEOUT = 0;

    private $redis;

    public function __construct($host)
    {
        $this->redis = new Redis();
        $this->redis->connect($host, 6379);
    }

    public function read($queue)
    {
        $command = $this->redis->blpop($queue, self::TIMEOUT);

        return $command;
    }

    public function write($queue, $response)
    {
        $this->redis->rpush($queue, $response);

        return $this;
    }
}
