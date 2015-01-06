var assert   = require("assert");
var Chipmunk = require('../lib/chipmunk');

var HOST     = '127.0.0.1';
var QUEUE    = 'test_queue_' + Date.now();
var MESSAGE  = 'Ni Hao!';
var METHOD   = 'Fang Fa';
var RESOURCE = 'Zi Yuan';
var DATA     = 'Shu Ju';
var RESPONSE = 'Hui Fu';

var chipmunk = new Chipmunk(HOST);

describe('chipmunk', function () {
  describe('generateCommand', function () {
    it ('should return a queue name', function (done) {
      var queueName       = chipmunk.generateQueueName(METHOD, RESOURCE, DATA);
      var expect          = 'poc-' + DATA + '-' + METHOD + '-' + RESOURCE + '-';
      var timestampString = Date.now().toString();

      queueName = queueName.substr(0, queueName.length - timestampString.length);
      assert.equal(expect, queueName);
      done();
    });
  });

  describe('generateCommand', function () {
    it ('should return a command', function (done) {
      var command = chipmunk.generateCommand(METHOD, RESOURCE, DATA, RESPONSE);
      var expect  = JSON.stringify({
        method: METHOD,
        resource: RESOURCE,
        data: DATA,
        response: RESPONSE
      });
      assert.equal(expect, command);
      done();
    });
  });

  describe('write and read', function () {
    it ('should not return error', function (done) {
      chipmunk.write(QUEUE, MESSAGE, function (err) {
        assert.ifError(err);
        done();
      });
    });

    it ('should read the correct message', function (done) {
      chipmunk.read(QUEUE, 10, function (err, response) {
        assert.ifError(err);
        assert.equal(QUEUE, response[0]);
        assert.equal(MESSAGE, response[1]);
        done();
      });
    });
  });
});
