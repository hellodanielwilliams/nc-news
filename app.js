const express = require('express')
const { getTopics } = require('./controllers/topics.controllers')

const app = express()

// endpoints:

app.get('/api/topics', getTopics)


// respond with 404 for any undefined endpoints:
app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not found'})
})

// middleware handling to be defined

// default to 500 error for any uncaught errors:
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
})

module.exports = app