const express = require('express')
const apiRouter = require('./routes/api-router')
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./middleware/error-handlers')

const app = express()

app.use(express.json())

app.use('/api', apiRouter)

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not found'})
})

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app