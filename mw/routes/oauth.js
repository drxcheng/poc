var express        = require('express');
var debug          = require('debug')('poc');
var google         = require('googleapis');
var mysql          = require('mysql');
var config         = require('../config.json');
var Authentication = require('../lib/authentication');

var app = express();
var connection = mysql.createConnection({
  host    : '10.30.50.115',
  user    : 'developer',
  password: 'noviLove',
  database: 'playground'
});

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
  var resource = 'user';
  var sql      = 'SELECT * FROM `user` WHERE `google_id` = ?';
  var bind     = [googlePlusUser.googleId];

  connection.query(sql, bind, function(err, result) {
    if (err) { throw err; }

    if (result.length === 0) {
      insertUserToDb(googlePlusUser, function (user) {
        debug('ADD user: ' + JSON.stringify(user));
        callback(user);
      });
    } else {
      debug('data: ' + JSON.stringify(result[0]));
      callback(result[0]);
    }
  });
};

var insertUserToDb = function (user, callback) {
  var sql  = 'INSERT INTO `user` (`google_id`, `name`) VALUES (?, ?)';
  var bind = [user.googleId, user.name]

  connection.query(sql, bind, function(err, result) {
    if (err) { throw err; }

    user.id = result.insertId;
    callback(user);
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
