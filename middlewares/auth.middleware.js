'use strict'

const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const logger = require('../services/logger.service');
const AppConst = require('../config/app.constants');
const ApiRes = require('../config/api-result-code');

/** ===========================================================================
 * Check authentication
 */
exports.checkAuth = async function(req, res, next) {
    console.log("checkAuth");
    next()
    // logger.debug('---- checkAuth with session token %s', req.session && req.session.token)
    // return res.sejson(401, ApiRes.AUTHORIZATION_REQUIRED)
}

