// Authentication Library
// Dealing with Oauth2
// This will be part of the middleware

var Oauth2Client = require('googleapis').auth.OAuth2;

var AUTH_OPTION = {
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/userinfo.email']
};

function Authentication(clientId, clientSecret, redirectUrl) {
  this.oauth2Client = new Oauth2Client(clientId, clientSecret, redirectUrl);
}

Authentication.prototype.getRedirectUrl = function () {
  var url = this.oauth2Client.generateAuthUrl(AUTH_OPTION);

  return url;
};

Authentication.prototype.authorizeCode = function (req, res, code, callback) {
  this.oauth2Client.getToken(code, function (err, tokens) {
    if (!err) {
      callback(req, res, tokens);
    } else {
      console.error(err);
      res.status(500).end();
    }
  });
};

module.exports = Authentication;
