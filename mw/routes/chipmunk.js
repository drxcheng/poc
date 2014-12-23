var express = require('express');
var app = express();
var chipmunk = require('../../chipmunkjs/lib/index');

var QUEUE_NAME = 'chipmunkjs-queue';

app.get('/', function(req, res) {
    chipmunk.read(QUEUE_NAME, function (err, item) {
        if (err) {
            console.err(err);
        } else {
            res.send(JSON.stringify(item));
        }
    });
});

app.post('/', function(req, res) {
    var item = req.body.item;
    if (!item) {
        return;
    }

    chipmunk.write(QUEUE_NAME, item, function (err) {
        if (err) {
            console.err(err);
            res.status(500).send(err);
        } else {
            res.send(req.body);
        }
    });
});

module.exports = app;
