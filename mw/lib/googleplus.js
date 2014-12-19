var config = require('../config.json');
var google = require('../node_modules/googleapis/lib/googleapis.js');

var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');

var oauth2Client = new OAuth2Client(config.clientId, config.clientSecret, config.redirectUrl);

var getMyInfo = function (req, res, tokens, callback) {
    oauth2Client.setCredentials(tokens);
    plus.people.get({
        userId: 'me',
        auth: oauth2Client
    }, function(err, people) {
        if (!err) {
            callback(req, res, people);
        } else {
            res.status(500).send(err);
        }
    });
};

module.exports = {
    getMyInfo: getMyInfo
};
