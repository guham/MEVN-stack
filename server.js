'use strict'

const createError = require('http-errors')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const debug = require('debug')('server')
const mongoose = require('mongoose')
require('dotenv').config()

// Express
const PORT = process.env.PORT
const HOST = process.env.HOST
// MongoDB
const MONGODB_USER = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_DATABASE = process.env.MONGO_INITDB_DATABASE

mongoose.Promise = require('bluebird')
mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@mongodb:27017/${MONGODB_DATABASE}`)

const db = mongoose.connection
db.on('error', () => debug('MongoDB connection error:'))
db.once('open', () => debug('MongoDB connection OK'))

const indexRouter = require('./routes/index');
const testRouter = require('./routes/test')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/', testRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.send('error')
  debug(res.locals)
})

app.listen(PORT, HOST)
debug(`Running on http://${HOST}:${PORT}`)
debug('Env: ' + app.get('env'))
