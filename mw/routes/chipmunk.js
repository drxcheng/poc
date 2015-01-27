var express  = require('express');
var debug    = require('debug')('poc');

var TIMEOUT = 2;

var app = express();

var getUserId = function (req, res) {
  var userId = req.query.id;

  if (!userId) {
    var user = req.session.user;

    if (user) {
      userId = user.id;
    }
  }

  return userId;
};

app.get('/', function(req, res) {
  var userId = getUserId(req, res);
  if (!userId) {
    console.error('unauthorized');
    res.status(401).end();
    return;
  }

  var resource = req.query.resource;
  var data;
  if (resource === 'user') {
    data = {id: userId};
  } else {
    data = {userId: userId};
  }

  chipmunk.send('poc', 'GET', resource, data, function (err, response) {
    if (err) {
      res.status(err).send(response);
    } else {
      res.send(response);
    }
  });
});

module.exports = app;
