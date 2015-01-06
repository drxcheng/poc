var express        = require('express');
var debug          = require('debug')('poc');
var http           = require('http');
var google         = require('googleapis')
var config         = require('../config.json');
var Authentication = require('../lib/authentication');

var app = express();

var getGoogleplusUser = function (req, res, tokens) {
  debug(tokens);

  var oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUrl);
  oauth2Client.setCredentials(tokens);
  google.plus('v1').people.get({
    userId: 'me',
    auth: oauth2Client
  }, function(err, people) {
    if (!err) {
      var user = {
        id: undefined,
        name: people.displayName,
        googleId: people.id
      };
      returnHome(req, res, user);
    } else {
      console.error(err);
      res.status(500).end();
    }
  });
};

var returnHome = function (req, res, user) {
  debug(user);
  if (config.userId) {
    user.id = config.userId;
    req.session.user = user;
    res.redirect('/');
  } else {
    getUserFromDb(user, function (user) {
      if (user) {
        req.session.user = user;
      }
      res.redirect('/');
    });
  }
};

var getUserFromDb = function (user, callback) {
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
          debug('BODY: ' + chunk);
          var user = JSON.parse(chunk);
          callback(user);
        });
        break;
      case 404:
        insertUserToDb(user, function (user) {
          debug('ADD user: ' + user);
          callback(user);
        });
        break;
      default:
        console.error(res.statusCode);
        callback();
    }
  });

  req.end();
};

var insertUserToDb = function (user, callback) {
  debug(user);

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
      debug('Response: ' + chunk);
      var user = JSON.parse(chunk);
      callback(user);
    });
  });

  req.write(body);
  req.end();
};

app.get('/', function(req, res) {
  debug(req.query);

  var code = req.query.code;
  var err = req.query.error;

  if (err) {
    console.error(err);
    res.send(err);
  } else if (code) {
    auth = new Authentication(config.clientId, config.clientSecret, config.redirectUrl);
    auth.authorizeCode(req, res, code, getGoogleplusUser);
  } else {
    console.error(req.query);
    res.status(500).end();
  }
});

module.exports = app;
