var express  = require('express');
var debug    = require('debug')('poc');
var config   = require('../config.json');
var Chipmunk = require('../lib/chipmunk');

var REDIS_QUEUE_NAME_SEND = 'poc-mw-to-be';
var TIMEOUT = 2;

var app      = express();
var chipmunk = new Chipmunk(config.redisHost, TIMEOUT);

var getUserId = function (req, res) {
  var userId = req.query.id;

  if (!userId) {
    var user = req.session.user;

    if (user) {
      userId = user._id;
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

  var queueToListen = chipmunk.generateQueueName('get', resource, userId);
  var command       = chipmunk.generateCommand('GET', resource, data, queueToListen);

  debug(command);

  chipmunk.process(command, REDIS_QUEUE_NAME_SEND, queueToListen, function (err, response) {
    if (err) {
      res.status(err).send(response);
    } else {
      res.send(response);
    }
  });
});

app.post('/', function(req, res) {
  var userId = getUserId(req, res);
  if (!userId) {
    console.error('unauthorized');
    res.status(401).end();
    return;
  }

  var resource = req.query.resource;
  var data = {
    userId: userId,
    value: req.body.value
  };

  var queueToListen = chipmunk.generateQueueName('post', resource, userId);
  var command       = chipmunk.generateCommand('POST', resource, data, queueToListen);

  debug(command);

  chipmunk.process(command, REDIS_QUEUE_NAME_SEND, queueToListen, function (err, response) {
    if (err) {
      res.status(err).end();
    } else {
      res.send(response);
    }
  });
});

module.exports = app;
