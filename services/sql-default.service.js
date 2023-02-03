/**
 * Sequalize Service를  제공 (Database wrapper)
 */
 const Sequelize = require("sequelize")
 const { DB_CONN_INFO } = require("../config/app.config")
 const logger = require("./logger.service")
 
 const sqlOption = require('../config/sequelize-automate-default.js').dbOptions

 // database, user, password
 const sequelize = new Sequelize(DB_CONN_INFO.database, 
         DB_CONN_INFO.user,
         DB_CONN_INFO.password, 
         sqlOption)
 
 module.exports = sequelize