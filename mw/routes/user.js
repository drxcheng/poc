var express = require('express');
var debug   = require('debug')('poc');

var app = express();

// add session user id to url
app.get('/', function (req, res, next) {
  var user = req.session.user;

  if (!user) {
    console.error('unauthorized');
    res.status(401).end();
    return;
  }

  debug(user);

  if (req.query.length === 0) {
    req.originalUrl += '&';
  } else {
    req.originalUrl += '?';
  }
  req.originalUrl += 'id=' + user.id;

  next();
})

module.exports = app;
