
const logger = require('./logger.service.js')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ useClones: false });

const CacheService = {
    set(key, val, ttl) {
        if (ttl > 0) myCache.set( key, val, ttl )
        else myCache.set( key, val )
    },

    get(key) {
        let value = myCache.get(key)
        if (!value) {
            // logger.warn(`Unknown key ${key}`)
            return null
        }
        else return value
    },

    getCache() {
        return myCache
    },

    delete(key) {
        return myCache.del(key)
    },

    keys() {
        return myCache.keys();
    },

    hasKey(key) {
        return myCache.keys();
    }
}

module.exports = CacheService