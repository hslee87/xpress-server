/**
 * 어플리케이션의 운영 상수
 * - 개발환경에 종속적인것은 app.config.js 를 활용
 */
'use strict'

const AppConst = {
    CRYPTO_SALT : '_YOUR_CRYPTO_SALT_',
    SESSION_SECRET : '_YOUR_SESSION_SECRET_KEY_',

    X_AUTHORIZATION : 'Authorization',
    X_AUTHORIZATION_BEARER : 'Bearer',
    SESSION_COOKIE_ID: 'SID',
    SECURITY_EMAIL_AUTH_VALID: 10 * 60 * 1000,      // 10 min

    DEFAULT_AGENT : 'Mozilla/5.0',
    
    END_OF_CONST : 'End Of Constants'
};

module.exports = AppConst;