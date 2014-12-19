var express = require('express');
var app = express();
var Memcached = require('memcached');
var memcached = new Memcached(MEMCACHED_HOST);

app.get('/', function(req, res) {
    memcached.get('user', function (err, data) {
        res.send(JSON.stringify(data));
    });
});

module.exports = app;
