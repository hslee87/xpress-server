/**
 * Admin Auth 
 * == Must be disable on production env.
 */
'use strict';

const { toCamel, toSnake } = require('snake-camel')

const logger = require('./logger.service.js');
const ApiRes = require('../config/api-result-code.js');

function modelToCamel(m) {
    return toCamel(m.dataValues)
}

const ModelCrudService = {

    toCamel(model) {
        return toCamel(model)
    },

    listToCamel(list) {
        return list.map(modelToCamel)
    },

    toSnake(data) {
        return toSnake(data)
    },

    listToSnake(list) {
        return list.map(toSnake)
    },

    async list(model, where, offset, limit) {
        const { count, rows } = await model.findAndCountAll({
            where,
            offset,
            limit
            });
        console.log('Count: %d', count, ' pageNo =', offset/limit)

        return { count, pageNo: parseInt(offset/limit), list: rows.map(modelToCamel) }
    },

    async insert(model, where, modelData) {
        let prev = await model.findOne({ where })
    
        if (!prev) {
            logger.info('Inserting model : %j', modelData)
            
            let m = await model.create(modelData);

            const newModel = await model.findByPk(m.id)

            logger.info('Model inserted : id = %s', newModel.id)
            return modelToCamel(newModel)
        }
        else {
            logger.warn('model exists : %j', prev)
            throw ApiRes.ALREADY_EXISTS
        }
    },

    async read(model, where) {
        let prev = await model.findOne({ where })
        
        if (!prev) {
            logger.warn('Cannot find model : where = %j', where)
            return null
        }
        else {
            return modelToCamel(prev)
        }
    },

    async update(model, where, updateData) {
        let prev = await model.findOne({ where })
    
        if (!prev) {
            logger.warn('Cannot find model : where = %j', where)
            throw ApiRes.NOT_FOUND
        }
        else {
            prev.set(updateData)
            await prev.save()

            return modelToCamel(prev)
        }
    }
}

module.exports = ModelCrudService
