const path = require('path');

const parameters = {
  app: {
    env: process.env.NODE_ENV,
    host: process.env.HOST,
    port: process.env.PORT,
    httpLogs: null,
    isInEnv(env) {
      return env === this.env;
    },
  },
  db: {
    uri: process.env.MONGODB_URI,
  },
};

if (parameters.app.isInEnv('test')) {
  parameters.db.uri = process.env.MONGODB_URI_TEST;
  parameters.app.httpLogs = path.resolve(process.env.PWD, 'tests', 'access.log');
}

module.exports = parameters;
