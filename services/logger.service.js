/**
 * Application Logger
 * 
 * Refer to : https://github.com/winstonjs/winston/tree/master/examples
 */
'use strict';

const {
    createLogger,
    format,
    transports
} = require("winston");

const rotateFile = require("winston-daily-rotate-file");
const fs = require("fs");
const logDir = "logs"
const logLevel = process.env.NODE_ENV == 'production' ? "info" : "debug";

var logFormat = format.combine(
    format.splat(),
    format.simple(), //     format.json()), format.prettyPrint()
    format.errors({ stack: true }),
    format.timestamp({
        format: "YYYY-MM-DDTHH:mm:ss.SSSZZ"
    }),
    // format.colorize(),
    format.printf(
        info => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
);

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    level: logLevel,
    filename: `${logDir}/app-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: false,
    maxSize: "20m",
    maxFiles: "7d"
});

let consoleLogFormat = format.combine(
    format.splat(),
    format.simple(), //     format.json()),
    format.errors({ stack: true }),
    format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS" // "YYYY-MM-DD HH:mm:ss"
    }),
    format.colorize(),
    format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

var consoleTransport = new transports.Console({
    // level: 'warn',
    format: consoleLogFormat
});

const logger = createLogger({
    level: logLevel,
    exitOnError: false,
    format: logFormat,
    transports: [
        dailyRotateFileTransport,
        consoleTransport
    ]
});

// logger.error = (err) => {
//     if (err instanceof Error) {
//       logger.log({ level: 'error', message: `${err.stack || err}` });
//     } else {
//       logger.log({ level: 'error', message: err });
//     }
// }

// logger.warn = (err) => {
//     if (err instanceof Error) {
//       logger.log({ level: 'warn', message: `${err.stack || err}` });
//     } else {
//       logger.log({ level: 'warn', message: err });
//     }
// }

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new transports.Console({
//     format: winston.format.simple()
//   }));
// }

module.exports = logger;