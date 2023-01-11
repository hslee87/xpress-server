/**
 * Email sender
 */
'use strict';

const util = require('util');
const nodemailer = require("nodemailer");
const logger = require('../services/logger.service');
const AppConst = require('../config/app.constants');
const { SMTP_INFO } = require('../config/app.config');


// async..await is not allowed in global scope, must use a wrapper
exports.send = function (from, to, subject, text, html) {

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: SMTP_INFO.host,   // "smtp.ethereal.email",
        port: SMTP_INFO.port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: SMTP_INFO.user,     // testAccount.user, // generated ethereal user
            pass: SMTP_INFO.password  // testAccount.pass // generated ethereal password
        }
    });

    // send mail with defined transport object
    const mailOption = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                logger.error(error);
                reject(null)
            } else {
                logger.debug('Message sent: %s', info.messageId);
                resolve(info.messageId)
            }
        });
    })

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}