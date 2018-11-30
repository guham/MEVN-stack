const { OAuth2Client } = require('google-auth-library');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const joi = require('joi');

class AuthenticationService {
  constructor({ parameters }) {
    this.authParameters = parameters.auth;
    this.client = new OAuth2Client(this.authParameters.clientId);
    this.options = {
      issuer: this.authParameters.jwtIssuer,
    };
    this.userPayloadSchema = joi.object().keys({
      sub: joi.string().required(),
    }).unknown();
    this.decodedTokenSchema = joi.object().keys({
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
  }

  async verifyIdToken(idToken) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.authParameters.clientId,
    });
    const payload = ticket.getPayload();
    return payload;
  }

  async validateUserPayload(userPayload) {
    const { error, value } = joi.validate(userPayload, this.userPayloadSchema);
    if (error instanceof Error) {
      return Promise.reject(error);
    }
    return value;
  }

  async validateTokenSchema(decodedToken, errorMessage) {
    const { error, value } = joi.validate(decodedToken, this.decodedTokenSchema);
    if (error instanceof Error) {
      error.message = errorMessage || error.message;
      return Promise.reject(error);
    }
    return value;
  }

  async signAccessToken(userPayload) {
    try {
      await this.validateUserPayload(userPayload);
    } catch (error) {
      throw new Error('User identifier is missing');
    }

    const options = {
      ...this.options,
      expiresIn: this.authParameters.accessTokenExpiresIn,
    };

    return jwt.sign({ uid: userPayload.sub }, this.authParameters.accessTokenSecretKey, options);
  }

  verifyAccessToken(token) {
    return jwt.verify(token, this.authParameters.accessTokenSecretKey, this.options);
  }

  /**
   * Validate and return the decoded access token
   * @param {string} authorizationHeader
   */
  async retrieveDecodedAccessToken(authorizationHeader) {
    try {
      const [scheme, accessToken] = authorizationHeader.split(' ');
      if (scheme !== 'Bearer') {
        throw new Error('Invalid authorization scheme');
      }

      const decodedAccessToken = jwt.decode(accessToken, { complete: true });
      try {
        await this.validateTokenSchema(decodedAccessToken, 'Invalid access token');
      } catch (error) {
        throw error;
      }

      return decodedAccessToken;
    } catch (e) {
      throw e instanceof TypeError ? new Error('Format is Authorization: Bearer [token]') : e;
    }
  }

  async createAndReturnTokens(payload) {
    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken(payload);
    const expirationDate = this.verifyAccessToken(accessToken).exp;
    return {
      accessToken,
      refreshToken,
      expirationDate,
    };
  }

  async signRefreshToken(userPayload) {
    try {
      await this.validateUserPayload(userPayload);
    } catch (error) {
      throw new Error('User identifier is missing');
    }

    const options = {
      ...this.options,
      expiresIn: this.authParameters.refreshTokenExpiresIn,
    };

    return jwt.sign({ uid: userPayload.sub }, this.authParameters.refreshTokenSecretKey, options);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, this.authParameters.refreshTokenSecretKey, this.options);
  }

  /**
   * Validate and return the decoded refresh token
   * @param {string} refreshToken
   */
  async retrieveDecodedRefreshToken(refreshToken) {
    const decodedRefreshToken = jwt.decode(refreshToken, { complete: true });
    return this.validateTokenSchema(decodedRefreshToken, 'Invalid refresh token');
  }

  async validateAndVerifyRefreshToken(refreshToken) {
    try {
      await this.retrieveDecodedRefreshToken(refreshToken);
      return this.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new createError.Unauthorized();
    }
  }
}

module.exports = AuthenticationService;
