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
  auth: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    jwtIssuer: process.env.JWT_ISSUER,
  },
};

if (parameters.app.isInEnv('test')) {
  parameters.db.uri = process.env.MONGODB_URI_TEST;
  parameters.app.httpLogs = path.resolve(process.env.PWD, 'tests', 'access.log');
}

module.exports = parameters;
