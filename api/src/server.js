const http = require('http');
const app = require('./app');
const containter = require('./container');

const db = containter.resolve('db');
const debug = containter.resolve('debug')('app');
const { port, host } = containter.resolve('parameters').app;

const start = async () => {
  try {
    await db.connect();
    const server = http.createServer(app).listen(port, host);
    debug(`Running on http://${host}:${port}`);
    debug(`Env: ${app.get('env')}`);
    return server;
  } catch (error) {
    debug('Server cannot be started');
    return undefined;
  }
};
// eslint-disable-next-line no-unused-vars
const server = start();
