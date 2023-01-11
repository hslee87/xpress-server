/**
 * Server Application Main Entry Point
 *
 */

/**
 * 매니저용 서버 Instance
 * 기본 포트 : 3000
 */
const ENVIRONMENT = process.env.NODE_ENV || 'local';

let SERVER_PORT = process.env.PORT || process.env.SERVER_PORT || 3000

let commandOptions = require('./command-options')

if (commandOptions && commandOptions.port > 0) SERVER_PORT = commandOptions.port
console.log('-- Env :', ENVIRONMENT)

//==========================================================
const express = require('express');
const serveStatic = require('serve-static');
const createError = require('http-errors');
const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream') // version 2.x

const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');
const session = require('express-session');

const routeIndex = require('./routes/index.route.js');
const routeApi = require('./routes/api.route.js');

const AppConst = require('./config/app.constants.js');
const ApiResultCode = require('./config/api-result-code.js');
const logger = require('./services/logger.service.js');
const clientLogger = require('./services/client-logger.service.js')

let expressApp = express();

if (ENVIRONMENT === 'dev') {
    // log only 4xx and 5xx responses to console
    expressApp.use(morgan('dev'));
}

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(process.cwd(), 'logs')
})

// setup the logger
expressApp.use(morgan('combined', {
    stream: accessLogStream
}))

// view engine setup
// expressApp.set('views', path.join(__dirname, 'views'));
// expressApp.set('view engine', 'pug');
expressApp.disable('x-powered-by');
expressApp.use(cookieParser());

// expressApp.use(bodyParser.urlencoded({
//     extended: true
// }));

// JSON은 기본 100KB 까지만 허용함.
expressApp.use(bodyParser.json({
    limit: 1024*1024*10
}));

// expressApp.use(bodyParser.text());
// expressApp.use(bodyParser.raw({ type: 'text/plain' }))

var corsOptions = {
    credentials: true,
    origin: (origin, callback) => callback(null, true)
}
expressApp.use(cors(corsOptions));

// X-Forwarded-For : 설정
expressApp.enable('trust proxy')

expressApp.use(session({
    secret: AppConst.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    rolling: true,
    name: AppConst.SESSION_COOKIE_ID,
    cookie: {
        path: '/',
        secure: false,
        maxAge: 3600 * 24 * 1000
    }
}));

// 모든 요청 시작에 항상 실행되는 루틴 (예:로거);
// Express API Override
// Normal Response :
//  - res.success(data)
// Status code and response data :
//  - res.sjson(status, retCode, data)
// Error Response :
//  - res.ejson(errCode, data)     // 400 status error code with data
expressApp.use(function(req, res, next) {

    // 에러를 리턴할 경우에 res.sejson() 또는 res.ejson() 을 이용한다.
    res.sejson = (status, errCode, data) => {
        console.log(` Status = ${status}, result = ${errCode}, data =`, data)

        if (!status) status = 200 // default HTTP OK status

        let strMsg = ''
        for (const [key, value] of Object.entries(ApiResultCode)) {
            if (value == errCode) {
                strMsg = key.replace(/_/g, ' ').toLowerCase()
                break
            }
        }

        if (!data) data = {}
        if (typeof data === 'string') {
            data = {
                code: errCode,
                data: data
            }
        }
        else {
            if (!data.code) data.code = errCode
            if (!data.msg) data.msg = strMsg
        }

        clientLogger.info({
            message: 'response',
            timestamp: Date.now(),
            clientIp: requestIp.getClientIp(req),
            status,
            errCode,
            reqPath: req.path,
            reqQuery: req.query,
            reqBody: req.body,
            resCode: data.code
        })

        res.status(status).json(data).end()
    }

    res.success = (data, message) => {
        if (!message) message = 'success'
        
        clientLogger.info({
            message,
            timestamp: Date.now(),
            clientIp: requestIp.getClientIp(req),
            reqPath: req.path,
            reqQuery: req.query,
            reqBody: req.body,
            resCode: data && data.code
        })
        res.json(data).end()
    }

    res.ejson = (errCode, data) => {
        // Bad Request (general request error)
        res.sejson(400, errCode, data)
    }

    // Old Style : 정상일때는 데이터만 내려주는 것으로 정리함.
    res.xjson = (errCode, data) => {
        res.sejson(200, errCode, data)
    }

    next();
});

// __dirname is used here along with package.json.pkg.assets
// see https://github.com/zeit/pkg#config and
// https://github.com/zeit/pkg#snapshot-filesystem
//

expressApp.use(serveStatic(path.resolve(__dirname, 'public')));

// Biz Logic Start
expressApp.use('/', routeIndex)
expressApp.use('/api/v1', routeApi)

// Routing information
expressApp.get('/health-check', (req, res) => {
    res.send('OK')
});
expressApp.get('/ping', (req, res) => {
    res.send('OK')
});

// Error Handler
expressApp.use(function(err, req, res, next) {
    console.log(err)
    res.sejson(501, ApiResultCode.INTERNAL_ERROR)
});

expressApp.use(function(req, res, next) {
    res.status(404).send('Not found')
});

// Listen to IPv4
expressApp.listen(SERVER_PORT, '0.0.0.0');

logger.info(`[MAIN]' PID ${process.pid} is listening on port ${SERVER_PORT}`);

// hslee: create uploads directory if not exists
const fs = require('fs');

var uploadDir = __dirname + '/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, 0744);
}

const mainService = require('./services/main.service.js');
;(async() => {
    logger.debug('Main Service  starting ..... ');
    await mainService.init();

    mainService.start();
})();

// -- Open Default Browser
// const open = require('open');
// (async () => {
// 	// Opens the URL in the default browser.
// 	await open(`http://localhost:${SERVER_PORT}`);
// })();
