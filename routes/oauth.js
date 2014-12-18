var express = require('express');
var app = express();
var Memcached = require('memcached');
var memcached = new Memcached(MEMCACHED_HOST);

var config = require('../config.json');
var google = require('../node_modules/googleapis/lib/googleapis.js');
var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');

var LIFETIME = 86400;
var oauth2Client = new OAuth2Client(config.clientId, config.clientSecret, config.redirectUrl);

var getAccessToken = function (res, code) {
    oauth2Client.getToken(code, function (err, tokens) {
        if (!err) {
            oauth2Client.setCredentials(tokens);
            getMyInfo(res);
        } else {
            res.status(500).send(err);
        }
    });
}

var getMyInfo = function (res) {
    plus.people.get({
        userId: 'me',
        auth: oauth2Client
    }, function(err, people) {
        if (!err) {
            saveSession(res, people);
        } else {
            res.status(500).send(err);
        }
    });
}

var saveSession = function (res, user) {
    memcached.set('user', user, LIFETIME, function (err) {
        res.redirect('/');
    });
}

app.get('/', function(req, res) {
    var code = req.query.code;
    var err = req.query.error;

    if (err) {
        res.send(err);
    } else if (code) {
        getAccessToken(res, code);
    } else {
        res.status(500).send(req.query);
    }
});

module.exports = app;
