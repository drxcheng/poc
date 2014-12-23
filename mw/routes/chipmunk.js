var express = require('express');
var app = express();
var chipmunk = require('../lib/chipmunk');

var REDIS_QUEUE_NAME_MW_TO_BE  = 'chipmunkjs-queue-mw-to-be';
var REDIS_QUEUE_NAME_BE_TO_MW = 'chipmunkjs-queue-be-to-mw';
var COMMAND = 'GET user';

app.get('/', function(req, res) {
    chipmunk.write(REDIS_QUEUE_NAME_MW_TO_BE, COMMAND, function (err) {
        if (err) {
            console.err(err);
            res.status(500).send(err);
        }
    });

    chipmunk.read(REDIS_QUEUE_NAME_BE_TO_MW, function (err, item) {
        if (err) {
            console.err(err);
        } else {
            res.send(JSON.stringify(item));
        }
    });
});

module.exports = app;
