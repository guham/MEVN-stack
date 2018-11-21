const createError = require('http-errors');
const container = require('../../../src/container');
const {
  getValidAccessToken,
  getInvalidAccessToken,
  getValidRefreshToken,
  getExpiredRefreshToken,
  getInvalidRefreshToken,
} = require('../../utils/tokens');

const authenticationService = container.resolve('authenticationService');
const validAccessToken = getValidAccessToken();
const invalidAccessToken = getInvalidAccessToken();
const validRefreshToken = getValidRefreshToken();
const expiredRefreshToken = getExpiredRefreshToken();
const invalidRefreshToken = getInvalidRefreshToken();

describe('Test Authentication service', () => {
  describe('Test methods related to access token', () => {
    describe('signAccessToken', () => {
      test('throws an error if `sub` object property does not exist', async () => {
        const payload = {};
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
        invalidAuthorizationHeaders.forEach(async (authorizationHeader) => {
          await expect(authenticationService.retrieveDecodedAccessToken(authorizationHeader)).rejects.toThrow(/Format is Authorization: Bearer \[token\]|Invalid authorization scheme|Invalid access token/);
        });
      });

      test('should returns the decoded payload if the authorization header is valid', async () => {
        const validAuthorizationHeader = `Bearer ${await validAccessToken}`;
        const decodedToken = await authenticationService.retrieveDecodedAccessToken(validAuthorizationHeader);
        expect(typeof decodedToken).toBe('object');
      });
    });
  });

  describe('Test methods related to refresh token', () => {
    describe('signRefreshToken', () => {
      test('throws an error if `sub` object property does not exist', async () => {
        const payload = {};
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
        invalidRefreshTokens.forEach(async (token) => {
          await expect(authenticationService.validateAndVerifyRefreshToken(token)).rejects.toThrow(error);
        });
      });

      test('should returns the decoded refresh token if it is valid', async () => {
        const token = await validRefreshToken;
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
