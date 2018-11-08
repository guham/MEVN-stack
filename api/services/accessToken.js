const jwt = require('jsonwebtoken');
const auth = require('./auth');
const {
  jwtIssuer,
  accessTokenSecretKey,
  accessTokenExpiresIn,
} = require('../parameters').parameters.auth;


exports.sign = (userPayload) => {
  auth.validateUserPayload(userPayload);

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
    auth.validateTokenSchema(decodedAccessToken, 'Invalid access token');

    return decodedAccessToken;
  } catch (e) {
    throw e instanceof TypeError ? new Error('Format is Authorization: Bearer [token]') : e;
  }
};
