const expressJwt = require('express-jwt');
const container = require('../container');

const { accessTokenSecretKey, jwtIssuer } = container.resolve('parameters').auth;

module.exports = expressJwt({
  secret: accessTokenSecretKey,
  issuer: jwtIssuer,
});
