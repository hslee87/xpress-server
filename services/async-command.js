/**
 * Async Command using redis 
 */
const redis = require("redis");
const logger = require('./logger.service.js')
const { v4: uuidv4 } = require('uuid')

const DEFAULT_TIMEOUT = 5       // in milli-seconds
const DEFAULT_TTL = 0           // expire in seconds, 0 = never expire
const DEFAULT_REDIS_KEY = 'async-command'
const DEFAULT_REDIS_URL = 'redis://localhost:6379/0'

/**
 * Request/Response command interface using redis list
 * <code>
 * // Instance
 * const asyncCmd = new AsyncCommand({ redisUrl: 'redis://localhost:6379/0', redisKey: 'async-command'})
 * 
 * // Client 
 * Type 1: request -> response
 * let result = await request()
 * 
 * Type 2: send - receive 
 * guid = sendRequest()   
 * await readResponse(guid)
 * 
 * // server
 * readRequest()
 * ...
 * sendResponse()
 *
 * </code>
 */
class AsyncCommand {
    constructor( { redisUrl, redisKey, ttl } ) {
        if (!redisUrl) redisUrl = DEFAULT_REDIS_URL
        if (!redisKey) redisKey = DEFAULT_REDIS_KEY

        // Redis instance
        this._client = null
        this.ready = false
        this.redisUrl = redisUrl
        this.expire = typeof ttl == 'number' ? ttl : DEFAULT_TTL

        this.keyRequest = `${redisKey}:request`
        this.keyResponse = `${redisKey}:response`
    }

    // force to connect to redis
    async connect() {
        const cmd = this

        const redisClient = redis.createClient(this.redisUrl)

        redisClient.on('error', (err) => logger.error('Redis Client Error', err))

        redisClient.on('ready', () => {
            cmd.ready = true
            logger.debug('Redis connected')
        })
        await redisClient.connect()

        this._client = redisClient
    }

    async close() {
        if (this._client) {
            await this._client.quit()
            this._client = null
            this.ready = false
        }
    }

    /**
     * Send request and wait for response
     * @param {*} command 
     * @param {*} data 
     * @param {*} timeout wait time in second, 0 = wait until response
     * @returns 
     */
    async request(name, data, timeout = DEFAULT_TIMEOUT) {
        if (!this.ready) {
            logger.error('Client is not ready')
            return null
        }

        const guid = await this.sendRequest(name, data)
        return await this.readResponse(guid, timeout)
    }

    /**
     * 요청을 보내고 즉시 리턴 
     * @param {*} name 
     * @param {*} data 
     * @returns 요청 guid
     */
    async sendRequest(name, data) {
        const client = this._client

        if (!this.ready) {
            logger.error('Client is not ready')
            return null
        }

        if (!data) data = {}

        const guid = uuidv4()
        const timestamp = Date.now()

        await client.LPUSH(this.keyRequest, JSON.stringify({
            guid, name, data, timestamp
        }))

        return guid
    }

    async readResponse(guid, timeout = DEFAULT_TIMEOUT) {
        const client = this._client

        if (!this.ready) {
            logger.error('Client is not ready')
            return null
        }

        let res = await client.BRPOP(`${this.keyResponse}:${guid}`, timeout)
        if (!res) return null

        return JSON.parse(res.element)
    }

    async readRequest(timeout = DEFAULT_TIMEOUT) {
        const client = this._client

        if (!client) {
            logger.error('Client is null')
            return null
        }

        const popRes = await client.BRPOP(this.keyRequest, timeout)
        if (!popRes) return null

        return JSON.parse(popRes.element)
    }

    async sendResponse(guid, name, data) {
        const client = this._client

        if (!client) {
            logger.error('Client is null')
            return null
        }

        const timestamp = Date.now()

        await client.LPUSH(`${this.keyResponse}:${guid}`, JSON.stringify({ guid, name, data, timestamp }))

        if (this.expire > 0) await client.EXPIRE(`${this.keyResponse}:${guid}`, 3600)
    }

    getRedisClient() {
        return this._client
    }

    async ping() {
        return await this.request('ping', '', {})
    }
}

module.exports = AsyncCommand