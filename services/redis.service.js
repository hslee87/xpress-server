/**
 * Redis Service
 */
 const AppConfig = require("config/app.config");
 const redis = require("redis");
 const {promisify} = require('util');
 
 const redisConnInfo =  AppConfig.REDIS_CONN_INFO
 
 const redisClient = redis.createClient(redisConnInfo);
  
 redisClient.on("error", function (err) {
     console.log("Error " + err);
 });
 
 // set redis api as Async
 redisClient.hgetallasync = promisify(redisClient.hgetall).bind(redisClient);
 redisClient.hgetasync = promisify(redisClient.hget).bind(redisClient);
 redisClient.hsetasync = promisify(redisClient.hset).bind(redisClient);
 redisClient.rpushasync = promisify(redisClient.rpush).bind(redisClient);
 redisClient.lrangeasync = promisify(redisClient.lrange).bind(redisClient);
 redisClient.llenasync = promisify(redisClient.llen).bind(redisClient);
 redisClient.existsasync = promisify(redisClient.exists).bind(redisClient);
 redisClient.getasync = promisify(redisClient.get).bind(redisClient);
 redisClient.setasync = promisify(redisClient.set).bind(redisClient);
 
 module.exports = redisClient