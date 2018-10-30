const expressJwt = require('express-jwt');
const { parameters } = require('../parameters');

exports.authenticate = expressJwt({
  secret: parameters.auth.accessTokenSecretKey,
  issuer: parameters.auth.jwtIssuer,
});
