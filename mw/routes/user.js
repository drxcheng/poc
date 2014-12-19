var express = require('express');
var app = express();
var Memcached = require('memcached');
var memcached = new Memcached(MEMCACHED_HOST);

app.get('/', function(req, res) {
    memcached.get('user', function (err, data) {
        var userJson = {};
        if (data) {
            userJson.id = data.id;
            userJson.email = data.emails[0].value;
            userJson.name = data.displayName;
            userJson.image = data.image.url;
        }

        res.send(JSON.stringify(userJson));
    });
});

module.exports = app;
