var express = require('express');
var app = express();
var config = require('../config.json');

var redis = require('redis').createClient(6379, config.redisHost);

var getKey = function (req, callback) {
    var userId = req.session.user.id;
    var googleId = req.session.user.googleId;
    var key = userId + '-' + googleId + '-items';

    callback(key);
}

app.get('/', function(req, res) {
    getKey(req, function (key) {
        redis.lrange(key, 0, -1, function (err, items) {
            res.send(JSON.stringify(items));
        });
    });
});

app.post('/', function(req, res) {
    var item = req.body.item;
    if (!item) {
        return;
    }

    getKey(req, function (key) {
        redis.rpush(key, item, function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(req.body);
            }
        });
    });
});

module.exports = app;
