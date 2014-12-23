var redis = require('redis').createClient();

module.exports = {
    read: function(queueName, callback) {
        redis.blpop(queueName, 0, function (err, response) {
            callback(err, response);
        });
    },

    write: function(queueName, request, callback) {
        redis.rpush(queueName, request, function (err) {
            callback(err);
        });
    }
};
