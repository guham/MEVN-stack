const expressJwt = require('express-jwt');
const { parameters } = require('../parameters');

exports.authenticate = expressJwt({
  secret: parameters.auth.jwtSecretKey,
  issuer: parameters.auth.jwtIssuer,
});
