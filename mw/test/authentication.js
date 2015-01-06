var assert         = require("assert");
var config         = require('../config.json');
var Authentication = require('../lib/authentication');

var authentication = new Authentication(config.clientId, config.clientSecret, config.redirectUrl);

describe('authentication', function () {
  describe('getRedirectUrl', function () {
    it ('should return a url', function (done) {
      var url = authentication.getRedirectUrl();
      assert.ok(url);
      done();
    });
  });
});
