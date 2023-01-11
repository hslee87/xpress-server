/**
 * Sequalize Service를  제공 (Database wrapper)
 */
 const Sequelize = require("sequelize")
 const { DB_CONN_INFO } = require("../config/app.config")
 const logger = require("../services/logger.service")
 
 const sql_option = {
     host: DB_CONN_INFO.host,
     dialect: "mysql", // 'mysql'|'sqlite'|'postgres'|'mssql',
     // operatorsAliases: false,   // SEQUELIZE0004, Deprecated
     define: {
         charset: 'utf8',
         collate: 'utf8_unicode_ci', 
         timestamps: false
     },
     logging: function(str) {
         // logger.debug(str)
     },
     pool: {
         max: 3,
         min: 0,
         acquire: 30000,
         idle: 10000
     }
     // SQLite only
     // storage: 'path/to/database.sqlite'
 }
 
 // database, user, password
 const sequelize = new Sequelize(DB_CONN_INFO.database, 
         DB_CONN_INFO.user,
         DB_CONN_INFO.password, 
         sql_option)
 
 module.exports = sequelize