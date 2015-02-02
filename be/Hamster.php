<?php

class Hamster
{
    const QUEUE_TO_LISTEN  = 'chipmunk-poc';

    private $chipmunk;

    private $router;

    public function __construct($chipmunk, $router)
    {
        $this->chipmunk = $chipmunk;
        $this->router   = $router;
    }

    public function run()
    {
        do {
            list($command, $key) = $this->chipmunk->consume(self::QUEUE_TO_LISTEN);
            echo "REQ: $command, key: $key\n";

            list($method, $url, $body) = $this->extractCommand($command);

            $responseJson = $this->router->getResponse($method, $url, $body);
            $response     = json_encode($responseJson);

            $this->chipmunk->respond($key, $response);
            echo "RES: $response\n";
        } while (true);
    }

    private function extractCommand($commandline)
    {
        $command = json_decode($commandline, true);
        if (empty($command)
            || !isset($command['method'])
            || !isset($command['url'])) {
            return null;
        }

        return [
            $command['method'],
            $command['url'],
            $command['body']
        ];
    }
}
