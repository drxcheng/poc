var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    memcached.get('user', function (err, data) {
        if (data) {
            var userJson = {
                id: data.id,
                email: data.emails[0].value,
                name: data.displayName,
                image: data.image.url
            };
            res.send(JSON.stringify(userJson));
        } else {
            res.render('index');
        }
    });
});

module.exports = router;
