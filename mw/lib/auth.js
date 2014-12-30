var http = require('http');

var config = require('../config.json');
var google = require('../node_modules/googleapis/lib/googleapis.js');
var googleplus = require('./googleplus');

var LIFETIME = 86400;
var PLUS_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email'
];

var OAuth2Client = google.auth.OAuth2;
var oauth2Client = new OAuth2Client(config.clientId, config.clientSecret, config.redirectUrl);

var redirectAuthUrl = function (res) {
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: PLUS_SCOPE
    });

    res.redirect(url);
};

var getAccessToken = function (req, res, code) {
    oauth2Client.getToken(code, function (err, tokens) {
        if (!err) {
            googleplus.getMyInfo(req, res, tokens, syncUserInfo);
        } else {
            res.status(500).send(err);
        }
    });
};

var syncUserInfo = function (req, res, people) {
    getUserFromDb(people, function (user) {
        if (user) {
            req.session.user = user;
        }
        res.redirect('/');
    });
};

var getUserFromDb = function (people, callback) {
    var user = {
        name: people.displayName,
        googleId: people.id
    };

    var options = {
        host: config.backend,
        port: 80,
        path: '?resource=user&googleId=' + user.googleId,
        method: 'GET'
    };

    var req = http.get(options, function (res) {
        switch (res.statusCode) {
            case 200:
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('BODY: ' + chunk);
                    var user = JSON.parse(chunk);
                    callback(user);
                });
                break;
            case 404:
                addUserToDb(user, function (user) {
                    console.log('ADD user: ' + user);
                    callback(user);
                });
                break;
            default:
                console.log('ERR: ' + res.statusCode);
                callback();
        }
    });

    req.end();
};

var addUserToDb = function (user, callback) {
    var body = JSON.stringify(user);

    var options = {
        host: config.backend,
        port: 80,
        path: '?resource=user',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            var user = JSON.parse(chunk);
            console.log(user);
            callback(user);
        });
    });

    req.write(body);
    req.end();
};

module.exports = {
    redirectAuthUrl: redirectAuthUrl,
    getAccessToken: getAccessToken
};
