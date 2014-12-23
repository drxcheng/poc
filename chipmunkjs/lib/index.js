var redis = require('redis').createClient();

module.exports = {
    read: function(queueName, callback) {
        redis.blpop(queueName, 0, function (err, item) {
            callback(err, item);
        });
    },

    write: function(queueName, item, callback) {
        redis.rpush(queueName, item, function (err) {
            callback(err);
        });
    }
};
