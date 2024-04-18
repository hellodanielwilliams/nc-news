const express = require('express')
const apiRouter = require('./routes/api-router')

const app = express()

app.use(express.json())

app.use('/api', apiRouter)

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
        if(err.code === '22P02' || err.code === '23502') {
            res.status(400).send({ msg: 'Bad request'})
        }
        if(err.code === '23503') {
            res.status(404).send({ msg: 'Article not found'})
        }
    }
    next(err)
  })
// default to 500 error for any uncaught errors:
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
})

module.exports = app