const jwt = require('jsonwebtoken');
const joi = require('joi');
const {
  jwtIssuer,
  accessTokenSecretKey,
  accessTokenExpiresIn,
} = require('../parameters').parameters.auth;

const schema = joi.object().keys({
  sub: joi.string().required(),
}).unknown();

const decodedAccessTokenSchema = joi.object().keys({
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
    expiresIn: accessTokenExpiresIn,
  };

  return jwt.sign({ uid: userPayload.sub }, accessTokenSecretKey, options);
};

exports.verify = (token) => {
  const options = {
    issuer: jwtIssuer,
  };

  return jwt.verify(token, accessTokenSecretKey, options);
};

exports.validateAndReturnDecodedToken = (authorizationHeader) => {
  try {
    const [scheme, accessToken] = authorizationHeader.split(' ');
    if (scheme !== 'Bearer') {
      throw new Error('Invalid authorization scheme');
    }

    const decodedAccessToken = jwt.decode(accessToken, { complete: true });
    const { error } = joi.validate(decodedAccessToken, decodedAccessTokenSchema);
    if (error) {
      throw new Error('Invalid access token');
    }

    return decodedAccessToken;
  } catch (e) {
    throw e instanceof TypeError ? new Error('Format is Authorization: Bearer [token]') : e;
  }
};
