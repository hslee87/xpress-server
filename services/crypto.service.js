'use strict';

const CryptoJS = require('crypto-js');
const AppConst = require('../config/app.constants');

const CRYPTO_SALT = AppConst.CRYPTO_SALT

const DEFAULT_ITERATION = 8        // 1024 : 100 ms 이상 걸림.

const CryptoService = {
    SHA256 : function(planeText) {
        return CryptoJS.SHA256(planeText);
    },
    HmacSHA256 : function (message, secretPassphrase) {
        return CryptoJS.HmacSHA256(message, secretPassphrase);
    },
    MD5 : function(planeText) {
        return CryptoJS.MD5(planeText);
    },
    bin2hex: function(s) {
        // From: http://phpjs.org/functions
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // +   bugfixed by: Linuxworld
        // +   improved by: ntoniazzi (http://phpjs.org/functions/bin2hex:361#comment_177616)
        // *     example 1: bin2hex('Kev');
        // *     returns 1: '4b6576'
        // *     example 2: bin2hex(String.fromCharCode(0x00));
        // *     returns 2: '00'

        var i, l, o = "",
            n;

        s += "";

        for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i).toString(16)
            o += n.length < 2 ? "0" + n : n;
        }

        return o;
    },
    // add functions for kvx web-mini //jw.kim
    PBKDF2 : function(pass) {
        const salt = CRYPTO_SALT;
        const iterations = DEFAULT_ITERATION;
        const keysize = (256 / 32);
        const ivsize = (128 / 32);

        var key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keysize,
            iterations: iterations
        });
        ////-- console.log('pbkdf2 key : ' + key.toString());  // test code
        var iv = CryptoJS.PBKDF2(salt, pass, {
            keySize: ivsize,
            iterations: iterations
        });
        ////-- console.log('pbkdf2 iv : ' + iv.toString());  // test code
    },
    encrypt: function(pass, plainText) {
        const salt = CRYPTO_SALT;
        const iterations = DEFAULT_ITERATION;
        const keysize = (128 / 32); //(256/32);
        const ivsize = (128 / 32);

        const key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keysize,
            iterations: iterations
        });
        ////-- console.log('pbkdf2 key : ' + key.toString());  // test code
        const iv = CryptoJS.PBKDF2(salt, pass, {
            keySize: ivsize,
            iterations: iterations
        });
        ////-- console.log('pbkdf2 iv : ' + iv.toString());  // test code
        const encrypted = CryptoJS.AES.encrypt(plainText, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });
        ////-- console.log('aes enc : ' + encrypted.toString());  // test code

        return encrypted.toString();
    },
    decrypt : function(pass, encText) {
        const salt = CRYPTO_SALT;
        const iterations = DEFAULT_ITERATION;
        const keysize = (128 / 32); //(256/32);
        const ivsize = (128 / 32);

        const key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keysize,
            iterations: iterations
        });
        ////-- console.log('pbkdf2 key : ' + key.toString());  // test code
        const iv = CryptoJS.PBKDF2(salt, pass, {
            keySize: ivsize,
            iterations: iterations
        });
        ////-- console.log('pbkdf2 iv : ' + iv.toString());  // test code
        const decrypted = CryptoJS.AES.decrypt(encText, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });
        ////-- console.log('aes dec : ' + decrypted);  // test code

        return decrypted.toString(CryptoJS.enc.Utf8);
    },
    make : function(seedText) {
        const salt = CRYPTO_SALT;
        const hmac2 = CryptoJS.HmacSHA256(seedText, salt);
        const hmac1 = CryptoJS.HmacSHA1(hmac2.toString().toUpperCase(), salt);
        ////-- console.log(hmac1.toString().toUpperCase());  // test code
        return hmac1.toString().toUpperCase();
    },
}

module.exports = CryptoService;