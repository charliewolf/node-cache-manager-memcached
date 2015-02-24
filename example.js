var util = require('util');
var cacheManager = require('cache-manager');
var memcachedStore = require('./index');
var memcachedCache = cacheManager.caching({
    store: memcachedStore,
    servers: ['127.0.0.1:11211'],
    ttl: 100
});
var ttl = 60;

console.log("set/get/del example:");

memcachedCache.set('foo', 'bar', {
    ttl: ttl
}, function(err) {
    if (err) {
        throw err;
    }

    memcachedCache.get('foo', function(err, result) {
        if (err) {
            throw err;
        }
        console.log("result fetched from cache: " + result);
        memcachedCache.del('foo', function(err) {
            if (err) {
                throw err;
            }
            console.log('deleted');
            memcachedCache.get('foo', function(err, result) {
                if (err) {
                    throw err;
                }
                console.log('now it should be gone');
                console.log(result);
                process.exit();
            });
        });

    });
});
