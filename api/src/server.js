const app = require('./app');
const debug = require('./components/debug')('app');
const { parameters } = require('./parameters');
// Express
const { port, host } = parameters.app;

const server = app.listen(port, host);
debug(`Running on http://${host}:${port}`);
debug(`Env: ${app.get('env')}`);

module.exports = server;
