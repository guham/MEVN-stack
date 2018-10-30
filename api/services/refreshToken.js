const jwt = require('jsonwebtoken');
const {
  jwtIssuer,
  refreshTokenSecretKey,
  refreshTokenExpiresIn,
} = require('../parameters').parameters.auth;

module.exports = (userPayload) => {
  const options = {
    issuer: jwtIssuer,
    expiresIn: refreshTokenExpiresIn,
  };

  return jwt.sign({ uid: userPayload.sub }, refreshTokenSecretKey, options);
};
