var express        = require('express');
var debug          = require('debug')('poc');
var google         = require('googleapis')
var config         = require('../config.json');
var Authentication = require('../lib/authentication')

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
    getUserFromBe(res, user, function (user) {
      if (user) {
        req.session.user = user;
      }
      res.redirect('/');
    });
  }
};

var getUserFromBe = function (res, googlePlusUser, callback) {
  var resource      = 'user';
  var data          = {googleId: googlePlusUser.googleId};

  chipmunk.send('poc', 'GET', resource, data, function (err, response) {
    if (err) {
      res.status(err).end();
    } else {
      var responseJson = JSON.parse(response);
      switch (responseJson.code) {
        case 200:
          debug('data: ' + JSON.stringify(responseJson.data));
          var user = responseJson.data;
          callback(user);
          break;
        case 404:
          insertUserToDb(googlePlusUser, function (user) {
            debug('ADD user: ' + user);
            callback(user);
          });
          break;
        default:
          console.error(responseJson.message);
          callback();
      }
    }
  });
};

var insertUserToDb = function (user, callback) {
  var resource      = 'user';
  var data          = JSON.stringify(user);

  chipmunk.send('poc', 'POST', resource, data, function (err, response) {
    if (err) {
      res.status(err).end();
    } else {
      var responseJson = JSON.parse(response);
      switch (responseJson.code) {
        case 200:
          debug('data: ' + JSON.stringify(responseJson.data));
          var user = responseJson.data;
          callback(user);
          break;
        default:
          console.error(responseJson.message);
          callback();
      }
    }
  });
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
