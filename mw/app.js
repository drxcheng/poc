var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var MemcachedStore = require('connect-memcached')(session);
var Chipmunk       = require('chipmunkjs');
var config         = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret: 'ThisIsASecret',
  resave: false,
  saveUninitialized: true,
  store: new MemcachedStore({
    hosts: config.memcachedHost + ':11211'
  })
}));

chipmunk = new Chipmunk;
chipmunk.addService('poc', 2);

app.use('/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/oauth', require('./routes/oauth'));
app.use('/api/poc/item', require('./routes/item'));
app.use('/api/poc/user', require('./routes/user'));

app.use('/api/poc/', chipmunk.forward('poc'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
