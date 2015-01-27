<?php

require_once 'config.php';
require_once 'Chipmunk.php';
require_once 'Router.php';
require_once 'Hamster.php';

$chipmunk = new Chipmunk('127.0.0.1');
$router   = new Router($config);
$hamster  = new Hamster($chipmunk, $router);

$hamster->run();
