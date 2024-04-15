const express = require('express')
const endpoints = require('./endpoints.json')
const { getTopics } = require('./controllers/topics.controllers')
const { getArticleById } = require('./controllers/articles.controllers')

const app = express()

app.use(express.json())
// endpoints:

app.get('/api', (req, res, next) => {
    res.status(200).send(endpoints)
})

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)


// respond with 404 for any undefined endpoints:
app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not found'})
})

// middleware err handling 



// default to 500 error for any uncaught errors:
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
})

module.exports = app