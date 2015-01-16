var express = require('express');

var app = express();

app.get('/', function(req, res) {
  var user = req.session.user;
  var name = undefined;

  if (user !== undefined) {
    name = user.name;
  }
console.log(user);
  res.render('index', {name: name, id: user._id});
});

module.exports = app;
