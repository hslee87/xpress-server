// Importing mysql and csvtojson packages
// Requiring module
const sqlService = require('../services/sql-default.service');

if (process.argv.length != 3) {
    // usage
    let filename = path.basename(process.argv[1])
    console.log(`Usage : NODE_ENV=<ENV_NAME> node ${filename} <arg1>`)
    console.log('\nENV_NAME: local|production|development ')
    process.exit(-1)
}

let currentEnv = process.env.NODE_ENV || 'local';

const validEnvs = ['local', 'development', 'production']

if (!validEnvs.includes(currentEnv)) {
    console.error('Not supported NODE_ENV : ${process.env.NODE_ENV}')
    process.exit(-1)
}

;(async() => {
    await sqlService.authenticate();

    try {
        // Do something
    }
    catch (err) {
        console.error('Error :', err)
    }
    sqlService.close();
})();
