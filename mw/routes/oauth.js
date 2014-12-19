var express = require('express');
var app = express();

var auth = require('../lib/auth');

app.get('/', function(req, res) {
    var code = req.query.code;
    var err = req.query.error;

    if (err) {
        res.send(err);
    } else if (code) {
        auth.getAccessToken(req, res, code);
    } else {
        res.status(500).send(req.query);
    }
});

module.exports = app;
