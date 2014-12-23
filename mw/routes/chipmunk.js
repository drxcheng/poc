var express = require('express');
var app = express();
var chipmunk = require('../lib/chipmunk');

var REDIS_QUEUE_NAME_READ  = 'chipmunkjs-queue-read';
var REDIS_QUEUE_NAME_WRITE = 'chipmunkjs-queue-write';
var COMMAND = 'GET user';

app.get('/', function(req, res) {
    chipmunk.write(REDIS_QUEUE_NAME_WRITE, COMMAND, function (err) {
        if (err) {
            console.err(err);
            res.status(500).send(err);
        }
    });

    chipmunk.read(REDIS_QUEUE_NAME_READ, function (err, item) {
        if (err) {
            console.err(err);
        } else {
            res.send(JSON.stringify(item));
        }
    });
});

module.exports = app;
