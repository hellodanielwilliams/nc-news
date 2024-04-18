const apiRouter = require('express').Router()

const endpoints = require('../endpoints.json')

const articlesRouter = require('./articles-router')
const commentsRouter = require('./comments-router')
const topicsRouter = require('./topics-router')
const usersRouter = require('./users-router')

apiRouter
    .route('/')
    .get((req, res, next) => res.status(200).send(endpoints))

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.use('/comments', commentsRouter)

apiRouter.use('/users', usersRouter)

module.exports = apiRouter