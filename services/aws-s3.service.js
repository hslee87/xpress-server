
const fs = require('fs');
const AWS = require('aws-sdk');
const AppConfig = require('../config/app.config.js');
const logger = require('./logger.service.js')

const AwsS3Service = {
    getS3() {
        AWS.config.update({ region: 'ap-northeast-2' });

        const awsAccessInfo = {
            accessKeyId: AppConfig.AWS_ACCESS_KEY,
            secretAccessKey: AppConfig.AWS_SECRET_KEY
        }
        // console.log('AWS Info :', awsAccessInfo)
        const s3 = new AWS.S3(awsAccessInfo);

        return s3
    },

    // promise
    upload(bucket, keyPath, file) {

        const params = {
            Bucket: bucket,
            Key: keyPath, // File name you want to save as in S3
            Body: file
        };

        return new Promise((resolve, reject) => {
            try {
                const awsS3 = this.getS3();

                awsS3.upload(params, function (err, data) {
                    if (err) reject(err);
                    else {
                        console.log(`File uploaded successfully. ${data.Location}`);
                        resolve(keyPath)
                    }
                });
            }
            catch (e) {
                reject(e)
            }
        });
    },

    // promise
    uploadByFilename(bucket, keyPath, filename) {
        const fileBody = fs.readFileSync(filename)
        return this.upload(bucket, keyPath, fileBody)
    },

    // promise
    download(bucket, keyPath, downloadPath) {
        const params = {
            Bucket: bucket,
            Key: keyPath
        };

        return new Promise((resolve, reject) => {
            try {
                let fileStream = fs.createWriteStream(downloadPath);
                const awsS3 = this.getS3();

                const stream = awsS3.getObject(params).createReadStream();
                stream.pipe(fileStream).on('error', (err) => reject(err))
                    .on('close', () => resolve())
            }
            catch (e) {
                reject(e)
            }
        });
    },

    // promise :
    // return false if NOT found
    //        true if found
    //
    exists(bucket, keyPath) {
        const awsS3 = this.getS3();
        return new Promise((resolve, reject) => {
            s3.headObject(params, function (err, metadata) {
                if (err) {
                    if (err.code === 'NotFound') resolve(false)
                    else reject(err)
                }
                else {
                    resolve(true)
                }
            });
        });
    },

    // promise : delete
    delete(bucket, keyPath) {
        const params = {
            Bucket: bucket,
            Key: keyPath
        };

        const awsAccessInfo = {
            accessKeyId: AppConfig.AWS_INFO.key,
            secretAccessKey: AppConfig.AWS_INFO.secret
        }
        const awsS3 = new AWS.S3(awsAccessInfo);

        return new Promise((resolve, reject) => {
            awsS3.deleteObject(params, function (err, data) {
                if (err) reject(err)
                else {
                    console.log(`File deleted successfully. ${data.Location}`);
                    resolve(true)
                }
            });
        });
    },
}

module.exports = AwsS3Service