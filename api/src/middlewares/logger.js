const morgan = require('morgan');
const fs = require('fs');
const container = require('../container');

const { app } = container.resolve('parameters');

const options = {};
if (app.isInEnv('test')) {
  const accessLogStream = fs.createWriteStream(app.httpLogs, { flags: 'a' });
  options.stream = accessLogStream;
}

const logger = morgan(app.isInEnv('development') ? 'dev' : 'combined', options);

module.exports = logger;
