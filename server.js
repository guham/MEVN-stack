require('dotenv').config()
const debug = require('debug')('server')
const app = require('./app')

// Express
const PORT = process.env.PORT
const HOST = process.env.HOST

const server = app.listen(PORT, HOST)
debug(`Running on http://${HOST}:${PORT}`)
debug('Env: ' + app.get('env'))

module.exports = server
