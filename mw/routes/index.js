var express = require('express');

var app = express();

app.get('/', function(req, res) {
  var user = req.session.user;
  var name = undefined;

  if (user !== undefined) {
    name = user.name;
  }

  res.render('index', {name: name});
});

module.exports = app;
