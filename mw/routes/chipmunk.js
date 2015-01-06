var express  = require('express');
var debug    = require('debug')('poc');
var config   = require('../config.json');
var Chipmunk = require('../lib/chipmunk');

var REDIS_QUEUE_NAME_SEND = 'poc-mw-to-be';
var TIMEOUT = 10;

var app      = express();
var chipmunk = new Chipmunk(config.redisHost);

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

var chipmunkWrite = function (res, command) {
  chipmunk.write(REDIS_QUEUE_NAME_SEND, command, function (err) {
    if (err) {
      console.error(err);
      res.status(500).end();
    } else {
      debug('sent ' + command + ' to ' + REDIS_QUEUE_NAME_SEND);
    }
  });
};

var chipmunkRead = function (res, queueName) {
  chipmunk.read(queueName, TIMEOUT, function (err, response) {
    if (err) {
      console.error(err);
      res.status(500).end();
    } else {
      debug('receive ' + response + ' from ' + queueName);
      res.send(JSON.stringify(response));
    }
  });
};

app.get('/', function(req, res) {
  var userId = getUserId(req, res);
  if (!userId) {
    console.error('unauthorized');
    res.status(401).end();
    return;
  }

  var resource      = req.query.resource;
  var queueToListen = chipmunk.generateQueueName('get', resource, userId);
  var command       = chipmunk.generateCommand('GET', resource, userId, queueToListen);

  debug(command);

  chipmunkWrite(res, command);
  chipmunkRead(res, queueToListen);
});

module.exports = app;
