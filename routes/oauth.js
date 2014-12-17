var config = require('../config.json');
var google = require('../node_modules/googleapis/lib/googleapis.js');
var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');
var plusScope = [
    'https://www.googleapis.com/auth/userinfo.email'
];

var oauth2Client = new OAuth2Client(config.clientId, config.clientSecret, config.redirectUrl);

var redirectAuthUrl = function (req, res) {
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: plusScope
    });

    res.writeHead(302, {
        Location: url
    });

    res.end();
}

var getAccessToken = function (res, code, callback, redirect) {
    oauth2Client.getToken(code, function (err, tokens) {
        if (!err) {
            oauth2Client.setCredentials(tokens);
            callback(res, redirect);
        } else {
            res.status(500).send(err);
        }
    });
}

var getMyInfo = function (res, callback) {
    plus.people.get({
        userId: 'me',
        auth: oauth2Client
    }, function(err, people) {
        if (!err) {
            callback(people);
        } else {
            res.status(500).send(err);
        }
    });
}

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var code = req.query.code;

    if (!code) {
        redirectAuthUrl(req, res);
    } else {
        getAccessToken(res, code, getMyInfo, function (user) {
            req.session.user = user;
            res.redirect('/');
        });
    }
});

module.exports = router;
