var express = require('express');
var router = express.Router();
var session = require('express-session');
var app = express();

router.get('/', function(req, res) {
    var user = req.session.user;
    if (user) {
        var userJson = {
            id: user.id,
            email: user.emails[0].value,
            name: user.displayName,
            image: user.image.url
        };
        res.send(JSON.stringify(userJson));
    } else {
        res.render('index');
    }
});

module.exports = router;
