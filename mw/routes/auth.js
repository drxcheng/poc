var express = require('express');
var app = express();
var Memcached = require('memcached');
var memcached = new Memcached(MEMCACHED_HOST);

var config = require('../config.json');
var google = require('../node_modules/googleapis/lib/googleapis.js');
var plusScope = [
    'https://www.googleapis.com/auth/userinfo.email'
];
var oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUrl);

var redirectAuthUrl = function (res) {
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: plusScope
    });

    res.redirect(url);
}

app.post('/', function(req, res) {
    var action = req.body.action;
    if (action === 'login') {
        redirectAuthUrl(res);
    } else if (action === 'logout') {
        memcached.del('user', function (err) {
            res.redirect('/');
        });
    } else {
        res.status(404);
    }
});

module.exports = app;
