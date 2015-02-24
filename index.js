var Memcached = require('memcached');
function noop(){

}

function memcachedStore(args) {
    var self = {};
    var args = args||{};
    var ttlDefault = args.ttl||0;
    self.name = 'memcached';
    servers = args.servers||[];
    if(servers.length === 0) servers = ['127.0.0.1:11211']
    var pool = new Memcached(servers);
    function handleResponse( cb, opts) {
        opts = opts || {};
        cb = cb || noop;
        return function(err, result) {

            if (err) { return cb(err); }
            if (opts.parse && result) {
                result = JSON.parse(result);
            }
            cb(null, result);
        };
    }

    self.get = function(key, options, cb) {
        if (typeof options === 'function') {
            cb = options;
        }
        pool.get(key, handleResponse(cb, {parse: true}));
    };

    self.set = function(key, value, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        options = options || {};
        var ttl = (options.ttl || options.ttl === 0) ? options.ttl : ttlDefault;
        var val = JSON.stringify(value);
        pool.set(key, val, ttl||0, handleResponse(cb))

   
    };

    self.del = function(key, cb) {
        pool.del(key, handleResponse(cb));
    };

    return self;
}

module.exports = {
    create: memcachedStore
};
