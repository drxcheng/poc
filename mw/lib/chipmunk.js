var redis = require('redis').createClient();

module.exports = {
    read: function(queueName, timeout, callback) {
        redis.blpop(queueName, timeout, function (err, response) {
            callback(err, response);
        });
    },

    write: function(queueName, request, callback) {
        redis.rpush(queueName, request, function (err) {
            callback(err);
        });
    }
};
