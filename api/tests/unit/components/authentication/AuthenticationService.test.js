const createError = require('http-errors');
const AuthenticationService = require('../../../../src/components/authentication/AuthenticationService');
const {
  getValidAccessToken,
  getInvalidAccessToken,
  getDecodedAccessToken,
  getExpiredRefreshToken,
  getInvalidRefreshToken,
  getDefaultUserPayload,
} = require('../../../tokens');

const validAccessToken = getValidAccessToken();
const invalidAccessToken = getInvalidAccessToken();
const expiredRefreshToken = getExpiredRefreshToken();
const invalidRefreshToken = getInvalidRefreshToken();

describe('Test Authentication service', () => {
  let authenticationService;

  const parameters = {
    auth: {
      clientId: 1,
      jwtIssuer: 'issuer',
      accessTokenExpiresIn: '1h',
      accessTokenSecretKey: 'secret',
      refreshTokenExpiresIn: '1h',
      refreshTokenSecretKey: 'secret',
    },
  };

  const client = {
    verifyIdToken: jest.fn(() => Promise.resolve(({
      getPayload: jest.fn(() => (getDefaultUserPayload())),
    }))),
  };

  describe('Test OAuth2 related methods', () => {
    describe('verifyIdToken', () => {
      test('returns the user payload if the id token is successfully verified', async () => {
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        const payload = await authenticationService.verifyIdToken('google-id-token');
        expect(payload).toEqual(getDefaultUserPayload());
        expect(authenticationService.client.verifyIdToken).toHaveBeenCalledWith({
          idToken: 'google-id-token',
          audience: 1,
        });
      });

      test('returns the client\'s error if something wrong happens', async () => {
        const error = new Error('Something bad happens');
        client.verifyIdToken.mockImplementation(() => Promise.reject(error));
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        try {
          await authenticationService.verifyIdToken('google-id-token');
        } catch (err) {
          expect(err).toEqual(error);
        }
      });
    });

    describe('validateUserPayload', () => {
      test('validates the user payload and returns it if the payload is valid', async () => {
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        const payload = getDefaultUserPayload();
        const value = await authenticationService.validateUserPayload(payload);
        expect(value).toEqual(payload);
      });

      test('rejects with the validation error if the payload is not valid', async () => {
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        const payload = {};
        await expect(authenticationService.validateUserPayload(payload)).rejects.toThrow();
      });
    });
  });

  describe('Test tokens related methods', () => {
    describe('validateTokenSchema', () => {
      test('validates the decoded token and returns it if the token is valid', async () => {
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        const token = await getDecodedAccessToken();
        const value = await authenticationService.validateTokenSchema(token);
        expect(value).toEqual(token);
      });

      test('rejects with the validation error if the decoded token is not valid', async () => {
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        const token = {};
        await expect(authenticationService.validateTokenSchema(token)).rejects.toThrow();
      });

      test('rejects with the custom error message if the decoded token is not valid', async () => {
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        const token = {};
        await expect(authenticationService.validateTokenSchema(token, 'Custom error message')).rejects.toThrow('Custom error message');
      });
    });
  });

  describe('Test methods related to access token', () => {
    describe('signAccessToken', () => {
      test('throws an error if `sub` object property does not exist', async () => {
        const payload = {};
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        await expect(authenticationService.signAccessToken(payload)).rejects.toThrow('User identifier is missing');
      });
    });

    describe('retrieveDecodedAccessToken', () => {
      test('throws an error if the authorization header is not valid', async () => {
        const invalidAuthorizationHeaders = [
          null,
          '',
          'invalid-token',
          `jwt ${await validAccessToken}`,
          `JWT ${await validAccessToken}`,
          `${await validAccessToken}`,
          `Bearer ${invalidAccessToken}`,
        ];
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        invalidAuthorizationHeaders.forEach(async (authorizationHeader) => {
          await expect(authenticationService.retrieveDecodedAccessToken(authorizationHeader)).rejects.toThrow(/Format is Authorization: Bearer \[token\]|Invalid authorization scheme|Invalid access token/);
        });
      });

      test('should returns the decoded payload if the authorization header is valid', async () => {
        const validAuthorizationHeader = `Bearer ${await validAccessToken}`;
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        const decodedToken = await authenticationService.retrieveDecodedAccessToken(validAuthorizationHeader);
        expect(typeof decodedToken).toBe('object');
      });
    });
  });

  describe('Test methods related to refresh token', () => {
    describe('signRefreshToken', () => {
      test('throws an error if `sub` object property does not exist', async () => {
        const payload = {};
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        await expect(authenticationService.signRefreshToken(payload)).rejects.toThrow('User identifier is missing');
      });
    });

    describe('validateAndVerifyRefreshToken', () => {
      test('throws an error if the refresh token is not valid', () => {
        const error = new createError.Unauthorized();
        const invalidRefreshTokens = [
          null,
          '',
          'invalid-refresh-token',
          `${invalidRefreshToken}`,
          `${expiredRefreshToken}`,
        ];
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        invalidRefreshTokens.forEach(async (token) => {
          await expect(authenticationService.validateAndVerifyRefreshToken(token)).rejects.toThrow(error);
        });
      });

      test('should returns the decoded refresh token if it is valid', async () => {
        authenticationService = new AuthenticationService({ parameters, oauth2Client: client });
        const token = await authenticationService.signRefreshToken(getDefaultUserPayload());
        const decodedToken = await authenticationService.validateAndVerifyRefreshToken(token);
        expect(typeof decodedToken).toBe('object');
        expect(Object.keys(decodedToken).sort()).toEqual([
          'exp',
          'iat',
          'iss',
          'uid',
        ].sort());
      });
    });
  });
});
