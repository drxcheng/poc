var express        = require('express');
var debug          = require('debug')('poc');
var google         = require('googleapis')
var monk           = require('monk');
var config         = require('../config.json');
var Authentication = require('../lib/authentication');

var MONGODB_HOST = 'localhost/poc';

var app   = express();
var db    = monk(MONGODB_HOST);
var users = db.get('users');

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
    getUserFromBe(res, user, function (user) {
      if (user) {
        req.session.user = user;
      }
      res.redirect('/');
    });
  }
};

var getUserFromBe = function (res, googlePlusUser, callback) {
  users.findOne({ googleId: googlePlusUser.googleId }, function (err, doc) {
    if (err) {
      res.status(err).end();
    } else {
      if (doc === null) {
        insertUserToDb(googlePlusUser, function (user) {
          debug('ADD user: ' + JSON.stringify(user));
          callback(user);
        });
      } else {
        callback(doc);
      }
    }
  });
};

var insertUserToDb = function (user, callback) {
  users.insert(user, function (err, doc) {
    if (err) {
      res.status(err).end();
    } else {
      callback(doc);
    }
  });
}

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
