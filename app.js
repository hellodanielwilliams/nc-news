const express = require('express')
const endpoints = require('./endpoints.json')
const { getTopics } = require('./controllers/topics.controllers')
const { getArticleById, getArticles } = require('./controllers/articles.controllers')
const { getCommentsByArticleId, postCommentByArticleId } = require('./controllers/comments.controllers')

const app = express()

app.use(express.json())

// endpoints:

app.get('/api', (req, res, next) => res.status(200).send(endpoints))

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)


// respond with 404 for any undefined endpoints:
app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not found'})
})

// middleware err handling 

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    next(err)
})

app.use((err, req, res, next) => {
    if(err.code) {
        if(err.code === '22P02') {
            res.status(400).send({ msg: 'Bad request'})
      }
    }
    next(err)
  })
// default to 500 error for any uncaught errors:
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
})

module.exports = app