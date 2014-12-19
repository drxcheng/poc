var express = require('express');
var app = express();
var Memcached = require('memcached');
var memcached = new Memcached(MEMCACHED_HOST);

app.get('/', function(req, res) {
    memcached.get('user', function (err, data) {
        var name = undefined;
        if (data) {
            name = data.displayName;
        }

        res.render('index', {name: name});
    });
});

module.exports = app;
