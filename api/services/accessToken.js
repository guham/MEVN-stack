const jwt = require('jsonwebtoken');
const {
  jwtIssuer,
  accessTokenSecretKey,
  accessTokenExpiresIn,
} = require('../parameters').parameters.auth;

module.exports = (userPayload) => {
  const options = {
    issuer: jwtIssuer,
    expiresIn: accessTokenExpiresIn,
  };

  return jwt.sign({ uid: userPayload.sub }, accessTokenSecretKey, options);
};
