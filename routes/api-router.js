const apiRouter = require('express').Router()
const endpoints = require('../endpoints.json')
const topicsRouter = require('./topics-router')

apiRouter.get('/', (req, res, next) => res.status(200).send(endpoints))

apiRouter.use('/topics', topicsRouter)

module.exports = apiRouter