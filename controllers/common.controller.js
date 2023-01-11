/**
 * Common Api Controller
 * 
 */
'use strict';

var logger = require('../services/logger.service.js');
const ApiRes = require('../config/api-result-code.js');
const pkg = require('../package.json')

const CommonController = {
    version(req, res) {
        res.json({
            version: pkg.version
        })
    },
    ping(req, res) {
        res.json({
            code: 0,
            msg: 'OK'
        })
    },
    notYetImplemented(req, res) {
        res.ejson(ApiRes.NOT_YET_IMPLEMENTED)
    },
    invalidAccess(req, res) {
        res.ejson(ApiRes.INVALID_ACCESS);
    },
    unsupportedMethod(req, res) {
        res.ejson(ApiRes.UNSUPPORTED_METHOD);
    }
}

module.exports = CommonController