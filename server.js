const createError = require('http-errors')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
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
const MONGODB_HOST = process.env.MONGODB_HOST
const MONGODB_PORT = process.env.MONGODB_PORT

const { defaultRoutes } = require('./routes')
const { apiRoutes } = require('./routes')

const app = express()

mongoose.Promise = require('bluebird')
mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`, {
  autoReconnect: true,
  reconnectTries: 3600,
  reconnectInterval: 1000,
  autoIndex: app.get('env') === 'development'
}).then(
  () => { debug('MongoDB connection OK') },
  err => { debug(err) }
)

const db = mongoose.connection
db.on('connected', () => debug('MongoDB connection: connected'))
db.on('disconnected', () => debug('MongoDB connection: disconnected'))
db.on('reconnect', () => debug('MongoDB connection: reconnected'))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())

app.use('/', defaultRoutes)
app.use('/api', apiRoutes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  debug(err.stack)

  res.status(err.status || 500)
  res.json({
    type: err.name,
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  })
})

app.listen(PORT, HOST)
debug(`Running on http://${HOST}:${PORT}`)
debug('Env: ' + app.get('env'))
