var express = require('express');
var app = express();

var auth = require('../lib/auth');

app.post('/', function(req, res) {
    var action = req.body.action;
    if (action === 'login') {
        auth.redirectAuthUrl(res);
    } else if (action === 'logout') {
        req.session.user = undefined;
        res.redirect('/');
    } else {
        res.status(404);
    }
});

module.exports = app;
