/**
 * Application Configuration
 */
'use strict';
const os = require("os")

/** --------------------------------------------
 * Local Config
 */
const connInfoLocal = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'dbuser',
    password: process.env.DB_PASS ||'dbpassword',
    database: process.env.DB_DATABASE || 'test',
}

// url = redis://username:password@hostname:port/db-number
const redisInfoLocal = {
    url: 'redis://localhost:6379/0'
}

/** --------------------------------------------
 * Development Config
 */
const connInfoDev = Object.assign({}, connInfoLocal)
const redisInfoDev = Object.assign({}, redisInfoLocal)

/** --------------------------------------------
 * Production Config
 */
const connInfoProd = Object.assign({}, connInfoLocal)
const redisInfoProd = Object.assign({}, redisInfoLocal)

const currentEnv = process.env.NODE_ENV || 'local';

const isProduction = currentEnv == 'production' || currentEnv == 'prod' ? true : false
const isDev = currentEnv == 'development' || currentEnv == 'dev' ? true : false

const DB_CONN_INFO = isProduction ? connInfoProd : (isDev ? connInfoDev : connInfoLocal)

const API_HOST = isProduction ? 'http://' + os.hostname() + ':3000/' : 'http://localhost:3000/'


// Exports
const AppConfig = {
    SECRET_KEY: '2a26ce1a46a1d448bd6e1d00abf796541c17e3b3c9b4b52508a866a53961188d',
    DB_CONN_INFO,
    API_HOST,
    AWS_ACCESS_KEY: '',
    AWS_SECRET_KEY: '',
    IS_PRODUCTION: isProduction,

    END_OF_CONFIG: 'End Of Config'
};

// ES5 Style
module.exports = AppConfig;

// ES6 Style
// export default AppConfig;