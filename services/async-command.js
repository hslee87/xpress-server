/**
 * Async Command using redis 
 */
 const AppConfig = require("../config/app.config");
 const redis = require("redis");
 const logger = require('./logger.service.js')
 const procUtil = require('../utils/process-util')
 const {REDIS_CONN_INFO, KEY_REQUEST, KEY_RESPONSE} = AppConfig
 const { v4: uuidv4 } = require('uuid')
 
 const WAIT_INTERVAL = 50
 const GARBAGE_DURATION = 3600_000     // clear all 1 hour-old responses
 
 class AsyncCommand {
     constructor() {
         // Redis instance
         this.ready = false
         this._client = null
     }
 
     async connect() {
         const cmd = this
 
         const redisClient = redis.createClient(REDIS_CONN_INFO)
 
         redisClient.on('error', (err) => logger.error('Redis Client Error', err))
 
         redisClient.on('ready', () => {
             cmd.ready = true
             logger.debug('Redis connected')
         })
         await redisClient.connect()
 
         this._client = redisClient
     }
 
     async disconnect() {
         if (this._client) {
             await this._client.quit()
             this._client = null
             this.ready = false
         }
     }
 
     getRedisClient() {
         return this._client
     }
 
     /**
      * 요청을 보내고 즉시 리턴 
      * @param {*} name 
      * @param {*} accessKey 
      * @param {*} data 
      * @returns 요청 uuid
      */
     async requestOnly(name, accessKey, data) {
         const client = this._client
 
         if (!this.ready) {
             logger.error('Client is not ready')
             return null
         }
 
         if (!accessKey) accessKey = ''
         if (!data) data = {}
 
         const uuid = uuidv4()
         const timestamp = Date.now()
 
         await client.LPUSH(KEY_REQUEST, JSON.stringify({
             uuid, accessKey, name, data, timestamp }))
 
         return uuid
     }
 
     /**
      * 요청을 보내고, 응답 수신 후 리턴
      * @param {*} name 
      * @param {*} accessKey 
      * @param {*} data 
      * @param {*} timeout wait time in milli-second, 0 = wait until response
      * @returns 
      */
     async request(name, accessKey, data, timeout = 0) {
         const client = this._client
 
         if (!this.ready) {
             logger.error('Client is not ready')
             return null
         }
 
         const uuid = await this.requestOnly(name, accessKey, data)
         return await this.checkResponse(uuid, timeout)
     }
 
     async checkResponse(uuid, timeout = 0) {
         const client = this._client
         
         if (!this.ready) {
             logger.error('Client is not ready')
             return null
         }
 
         const tsWait = Date.now()
 
         while (timeout == 0 || timeout > (Date.now() - tsWait)) {
             const res = await client.HGET(KEY_RESPONSE, uuid)
 
             if (res) {
                 await client.HDEL(KEY_RESPONSE, uuid)
                 return JSON.parse(res)
             }
             else {
                 procUtil.delay(WAIT_INTERVAL)
             }
         }
         console.log('return null');
         return null
     }
 
     async ping() {
         return await this.request('ping', '', {})
     }
 
     async readRequest() {
         const client = this._client
 
         if (!client) {
             logger.error('Client is null')
             return null
         }
 
         const popRes = await client.BRPOP(KEY_REQUEST, 1)
         if (!popRes) return null
     
         return JSON.parse(popRes.element)
     }
 
     writeResponse(uuid, name, data) {
         const client = this._client
 
         if (!client) {
             logger.error('Client is null')
             return null
         }
 
         const timestamp = Date.now()
 
         client.HSET(KEY_RESPONSE, uuid, JSON.stringify({ uuid, name, data, timestamp }))
     }
 
     async clearGarbage(duration = GARBAGE_DURATION) {
         const client = this._client
 
         if (!client) {
             logger.error('Client is null')
             return null
         }
 
         logger.info(`Clear garbage with ${duration/1000} seconds olds`)
 
         const timeLimit = Date.now() - duration
         const responses = await client.HGETALL(KEY_RESPONSE)
 
         if (responses) {
             let clearCount = 0
 
             const keys = Object.keys(responses)
             
             for (const k of keys) {
                 const res = JSON.parse(responses[k])
 
                 if (res.timestamp < timeLimit) {
                     await client.HDEL(KEY_RESPONSE, res.uuid)
                     clearCount ++
                 }
             }
 
             logger.info(`Garbage cleared ${clearCount} items with ts = ${timeLimit} seconds olds`)
         }
         else {
             logger.info(`No garbage found`)
         }
     }
 }
 
 module.exports = AsyncCommand