const { accessTokenService } = require('../../services');
const { getValidAccessToken, getInvalidAccessToken } = require('../utils/tokens');

const validAccessToken = getValidAccessToken();
const invalidAccessToken = getInvalidAccessToken();

describe('Test accessToken service', () => {
  describe('sign', () => {
    test('throws an error if `sub` object property does not exist', () => {
      const payload = {};
      expect(() => {
        accessTokenService.sign(payload);
      }).toThrow();
    });
  });

  describe('validateAndReturnDecodedToken', () => {
    test('throws an error if the authorization header is not valid', () => {
      const invalidAuthorizationHeaders = [
        null,
        '',
        'invalid-token',
        `jwt ${validAccessToken}`,
        `JWT ${validAccessToken}`,
        `${validAccessToken}`,
        `Bearer ${invalidAccessToken}`,
      ];
      invalidAuthorizationHeaders.forEach((authorizationHeader) => {
        expect(() => {
          accessTokenService.validateAndReturnDecodedToken(authorizationHeader);
        }).toThrow(/Format is Authorization: Bearer \[token\]|Invalid authorization scheme|Invalid access token/);
      });
    });

    test('should returns the decoded payload if the authorization header is valid', () => {
      const validAuthorizationHeader = `Bearer ${validAccessToken}`;
      const decodedToken = accessTokenService.validateAndReturnDecodedToken(validAuthorizationHeader);
      expect(typeof decodedToken).toBe('object');
    });
  });
});
