const AppConfig = require("./app.config")

module.exports = {
    dbOptions: {
        database: 'test',
        host: AppConfig.DB_CONN_INFO.host,
        username: AppConfig.DB_CONN_INFO.user,
        password: AppConfig.DB_CONN_INFO.password,
      
        dialect: "mysql", // 'mysql'|'sqlite'|'postgres'|'mssql',
        define: {
            underscored: true,
            freezeTableName: false,
            paranoid: false,          // use soft delete
            //--- don't add the timestamp attributes (updatedAt, createdAt)
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        
            charset: 'utf8mb4',
            timezone: '+00:00',
            dialectOptions: {
              collate: 'utf8_general_ci',
            },
        },
        logging: function (str) {
        },
        pool: {
            max: 3,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    options: {
        type: "js",
        dir: "models",
        camelCase: false, // Model name camel case. Default is false.
        fileNameCamelCase: false, // Model file name camel case. Default is false.
        typesDir: 'models', // What directory to place the models' definitions (for typescript), default is the same with dir.
    }
}