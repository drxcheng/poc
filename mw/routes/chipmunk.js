var express = require('express');
var app = express();
var chipmunk = require('../lib/chipmunk');

var REDIS_QUEUE_NAME_SEND  = 'poc-mw-to-be';

app.get('/', function(req, res) {
    var resource = req.query.resource;
    var user = req.session.user;

    if (!user) {
        res.status(401).send();
    }

    /**
     * response queue name format: chipmunk-userId-method-resource-timestamp
     */
    var queueToListen = 'poc-' + user.id + '-get-' + resource + '-' + Date.now();
    var command = JSON.stringify({
        method: 'GET',
        resource: resource,
        data: user.id,
        response: queueToListen
    });

    console.log(command);

    chipmunk.write(REDIS_QUEUE_NAME_SEND, command, function (err) {
        if (err) {
            console.err(err);
            res.status(500).send(err);
        }
    });

    chipmunk.read(queueToListen, 0, function (err, item) {
        if (err) {
            console.err(err);
        } else {
            res.send(JSON.stringify(item));
        }
    });
});

module.exports = app;
