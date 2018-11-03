const jwt = require('jsonwebtoken');
const joi = require('joi');
const {
  jwtIssuer,
  refreshTokenSecretKey,
  refreshTokenExpiresIn,
} = require('../parameters').parameters.auth;

const schema = joi.object().keys({
  sub: joi.string().required(),
}).unknown();

const decodedRefreshTokenSchema = joi.object().keys({
  header: {
    alg: joi.string().required(),
    typ: joi.string().required(),
  },
  payload: {
    uid: joi.string().required(),
    iat: joi.number().required(),
    exp: joi.number().required(),
    iss: joi.string().required(),
  },
  signature: joi.string().required(),
});

exports.sign = (userPayload) => {
  const { error } = joi.validate(userPayload, schema);
  if (error) {
    throw new Error('User identifier is missing');
  }

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
  try {
    const decodedRefreshToken = jwt.decode(refreshToken, { complete: true });
    const { error } = joi.validate(decodedRefreshToken, decodedRefreshTokenSchema);
    if (error) {
      throw new Error();
    }
    return exports.verify(refreshToken);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
