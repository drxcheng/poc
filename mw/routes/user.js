var express = require('express');
var app = express();

app.get('/', function(req, res) {
    var user = req.session.user;
    res.send(JSON.stringify(user));
});

module.exports = app;
