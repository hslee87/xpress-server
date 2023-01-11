/**
 * Test Controller
 * == Must be disable on production env.
 */
'use strict';

var logger = require('../services/logger.service.js');
const ApiRes = require('../config/api-result-code.js');
const CacheService = require('../services/cache.service.js');
const util = require('util');

const TestController = {
    test(req, res) {
        console.log("test, user : %s", req.user.id);
        console.log("category : %s", req.body.category);
        let output = {1:"woo", 2:"kim", 3:"lee"};
        return res.success(output);
    },
}

module.exports = TestController