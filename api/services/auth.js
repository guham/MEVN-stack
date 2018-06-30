const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { parameters } = require('../parameters');

const client = new OAuth2Client(parameters.auth.clientId);

exports.verifyIdToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: parameters.auth.clientId,
  });
  const payload = ticket.getPayload();
  return payload;
};

exports.generateJwt = (userPayload) => {
  const options = {
    issuer: parameters.auth.jwtIssuer,
    expiresIn: '2h',
  };

  return jwt.sign({ uid: userPayload.sub }, parameters.auth.jwtSecretKey, options);
};

exports.verifyJwt = (token) => {
  const options = {
    issuer: parameters.auth.jwtIssuer,
  };

  return jwt.verify(token, parameters.auth.jwtSecretKey, options);
};
