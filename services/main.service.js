const logger = require('./logger.service.js')

const CacheService = require('../services/cache.service.js');

/**
 * Main Service
 */
class MainService {
    constructor() {
    }

    async init() {
    }

    /**
     * 
     */
    async exec() {
        // LOOP
        // DataChain Broker to request
    }

    start() {
        this.exec()
    }
}

let mainService = new MainService('MainService')

module.exports = mainService;