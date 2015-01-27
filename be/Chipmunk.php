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

    public function consume($queue)
    {
        $message = $this->redis->blpop($queue, self::REQUEST_TIMEOUT);
        $key = $message[1];

        $command = $this->redis->get($key);

        return [$command, $key];
    }

    public function respond($key, $response)
    {
        $queue = 'chipmunk-res-' . $key;
        $this->redis->rpush($queue, $response);
        $this->redis->expire($queue, self::RESPONSE_TIMEOUT);

        return $this;
    }
}
