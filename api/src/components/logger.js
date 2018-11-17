const morgan = require('morgan');
const fs = require('fs');
const { parameters } = require('../parameters');

const options = {};
if (parameters.app.isInEnv('test')) {
  const accessLogStream = fs.createWriteStream(parameters.app.httpLogs, { flags: 'a' });
  options.stream = accessLogStream;
}

const logger = morgan(parameters.app.isInEnv('development') ? 'dev' : 'combined', options);

module.exports = logger;
