<?php

class Hamster
{
    const QUEUE_TO_LISTEN  = 'poc-mw-to-be';

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
            $command = $this->chipmunk->read(self::QUEUE_TO_LISTEN);
            echo "REQ: " . $command[1] . "\n";

            list($method, $resource, $data, $responseQueue) = $this->extractCommand($command[1]);

            $responseJson = $this->router->getResponse($method, $resource, $data);
            $response     = json_encode($responseJson);

            $this->chipmunk->write($responseQueue, $response);
            echo "RES: $response\n";
        } while (true);
    }

    private function extractCommand($commandline)
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
}
