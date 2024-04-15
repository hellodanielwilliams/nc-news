const express = require('express')

const app = express()

// endpoints to be defined:


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