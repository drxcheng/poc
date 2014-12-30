var express = require('express');
var app = express();
var http = require('http');

var config = require('../config.json');

var getItem = function (id, userId, resParent) {
    var path = '';
    if (id) {
        path = '?resource=item&id=' + id;
    } else {
        path = '?resource=item&userId=' + userId;
    }

    var options = {
        host: config.backend,
        port: 80,
        path: path,
        method: 'GET'
    };

    var req = http.get(options, function (res) {
        switch (res.statusCode) {
            case 200:
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    resParent.send(chunk);
                });
                break;
            default:
                console.log('ERR: ' + res.statusCode);
                resParent.status(res.statusCode).end();
        }
    });

    req.end();
};

app.get('/', function(req, res) {
    if (req.query.id) {
        getItem(req.query.id, null, res);
    } else {
        var userId = req.session.user.id;
        getItem(null, userId, res);
    }
});

app.post('/', function(req, resParent) {
    var item = req.body;
    var userId = req.session.user.id;
    item.userId = userId;
    var body = JSON.stringify(item);

    var options = {
        host: config.backend,
        port: 80,
        path: '?resource=item',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            resParent.send(chunk);
        });
    });

    req.write(body);
    req.end();
});

module.exports = app;
