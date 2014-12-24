var express = require('express');
var app = express();
var chipmunk = require('../lib/chipmunk');
var Memcached = require('memcached');
var memcached = new Memcached(MEMCACHED_HOST);

var REDIS_QUEUE_NAME_MW_TO_BE  = 'chipmunkjs-queue-mw-to-be';
var REDIS_QUEUE_NAME_BE_TO_MW = 'chipmunkjs-queue-be-to-mw';

app.get('/', function(req, res) {
    var resource = req.query.resource;

    memcached.get('user', function (err, user) {
        if (err || !user) {
            console.err(err);
            res.status(500).send(err);
        }

        var command = 'GET ' + resource + ' ' + user.id;

        chipmunk.write(REDIS_QUEUE_NAME_MW_TO_BE, command, function (err) {
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
});

module.exports = app;
