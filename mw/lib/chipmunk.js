// Chipmunk Library
// Provide method for write and read
// This will be part of the middleware

function Chipmunk(host) {
  this.redis = require('redis').createClient(6379, host);
}

Chipmunk.prototype.generateQueueName = function (method, resource, key) {
  var queueName = 'poc-' + key + '-' + method + '-' + resource + '-' + Date.now();

  return queueName;
};

Chipmunk.prototype.generateCommand = function (method, resource, data, queueToListen) {
  var command = JSON.stringify({
    method: method,
    resource: resource,
    data: data,
    response: queueToListen
  });

  return command;
};

Chipmunk.prototype.write = function (queueName, message, callback) {
  this.redis.rpush(queueName, message, function (err) {
    callback(err);
  });
};

Chipmunk.prototype.read = function (queueName, timeout, callback) {
  this.redis.blpop(queueName, timeout, function (err, response) {
    callback(err, response);
  });
};

module.exports = Chipmunk;
