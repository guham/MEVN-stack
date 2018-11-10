const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const auth = require('./auth');
const {
  jwtIssuer,
  refreshTokenSecretKey,
  refreshTokenExpiresIn,
} = require('../parameters').parameters.auth;

exports.sign = (userPayload) => {
  auth.validateUserPayload(userPayload);

  const options = {
    issuer: jwtIssuer,
    expiresIn: refreshTokenExpiresIn,
  };

  return jwt.sign({ uid: userPayload.sub }, refreshTokenSecretKey, options);
};

exports.verify = (token) => {
  const options = {
    issuer: jwtIssuer,
  };

  return jwt.verify(token, refreshTokenSecretKey, options);
};

exports.validateAndReturnDecodedToken = (refreshToken) => {
  const decodedRefreshToken = jwt.decode(refreshToken, { complete: true });
  return auth.validateTokenSchema(decodedRefreshToken, 'Invalid refresh token');
};

exports.validateAndVerifyRefreshToken = (refreshToken) => {
  try {
    exports.validateAndReturnDecodedToken(refreshToken);
    return exports.verify(refreshToken);
  } catch (error) {
    throw new createError.Unauthorized();
  }
};
