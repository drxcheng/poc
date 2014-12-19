var express = require('express');
var app = express();
var Memcached = require('memcached');
var memcached = new Memcached(MEMCACHED_HOST);

var auth = require('../lib/auth');

app.post('/', function(req, res) {
    var action = req.body.action;
    if (action === 'login') {
        auth.redirectAuthUrl(res);
    } else if (action === 'logout') {
        memcached.del('user', function (err) {
            res.redirect('/');
        });
    } else {
        res.status(404);
    }
});

module.exports = app;
