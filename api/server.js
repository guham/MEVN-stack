const debug = require('debug')('server');
const app = require('./app');

// Express
const { PORT, HOST } = process.env;

const server = app.listen(PORT, HOST);
debug(`Running on http://${HOST}:${PORT}`);
debug(`Env: ${app.get('env')}`);

module.exports = server;
