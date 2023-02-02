const AppConfig = require("./app.config")

module.exports = {
    // Sequelize options: http://docs.sequelizejs.com
    sqlOption: {
        host: AppConfig.DB_CONN_INFO.host,
        username: AppConfig.DB_CONN_INFO.user,
        password: AppConfig.DB_CONN_INFO.password,
      
        dialect: "mysql", // 'mysql'|'sqlite'|'postgres'|'mssql',
        define: {
            underscored: true,
            freezeTableName: false,
            // Turn off soft delete
            paranoid: false,  
            // Disable updatedAt, createdAt
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        
            charset: 'utf8', // use utf8mb4 for emoji
            timezone: '+00:00',
            dialectOptions: {
              collate: 'utf8_unicode_ci',
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
    // 'sequelize-automate' options
    options: {
        type: "js",
        dir: "models",
        camelCase: false, // Model name camel case. Default is false.
        fileNameCamelCase: false, // Model file name camel case. Default is false.
        typesDir: 'models', // What directory to place the models' definitions (for typescript), default is the same with dir.
    }
}