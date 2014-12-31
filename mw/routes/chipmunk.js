var express = require('express');
var app = express();
var chipmunk = require('../lib/chipmunk');

var REDIS_QUEUE_NAME_SEND  = 'poc-mw-to-be';

app.get('/', function(req, res) {
    var resource = req.query.resource;
    var userId = req.query.id

    if (!userId) {
        var user = req.session.user;

        if (!user) {
            res.status(401).send();
        }

        userId = user.id;
    }

    /**
     * response queue name format: chipmunk-userId-method-resource-timestamp
     */
    var queueToListen = 'poc-' + userId + '-get-' + resource + '-' + Date.now();
    var command = JSON.stringify({
        method: 'GET',
        resource: resource,
        data: userId,
        response: queueToListen
    });

    chipmunk.write(REDIS_QUEUE_NAME_SEND, command, function (err) {
        if (err) {
            console.err(err);
            res.status(500).send(err);
        }
    });

    chipmunk.read(queueToListen, 10, function (err, item) {
        if (err) {
            console.err(err);
        } else {
            res.send(JSON.stringify(item));
        }
    });
});

module.exports = app;
