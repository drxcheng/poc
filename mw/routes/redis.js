var express = require('express');
var app = express();
var Redis = require('redis');
var Memcached = require('memcached');

var memcached = new Memcached(MEMCACHED_HOST);
var redis = Redis.createClient();

var getKey = function (callback) {
    memcached.get('user', function (err, data) {
        var key = '-items';
        if (data) {
            key = data.id + '-' + data.googleId + key;
        }

        callback(key);
    });
}

app.get('/', function(req, res) {
    getKey(function (key) {
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

    getKey(function (key) {
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
