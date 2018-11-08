const { OAuth2Client } = require('google-auth-library');
const joi = require('joi');
const { parameters } = require('../parameters');

const client = new OAuth2Client(parameters.auth.clientId);

const userPayloadSchema = joi.object().keys({
  sub: joi.string().required(),
}).unknown();

const decodedTokenSchema = joi.object().keys({
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

exports.verifyIdToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: parameters.auth.clientId,
  });
  const payload = ticket.getPayload();
  return payload;
};

exports.validateUserPayload = (userPayload) => {
  const { error, value } = joi.validate(userPayload, userPayloadSchema);
  if (error instanceof Error) {
    throw new Error('User identifier is missing');
  }
  return value;
};

exports.validateTokenSchema = (decodedToken, errorMessage) => {
  const { error, value } = joi.validate(decodedToken, decodedTokenSchema);
  if (error instanceof Error) {
    error.message = errorMessage || error.message;
    throw error;
  }
  return value;
};
