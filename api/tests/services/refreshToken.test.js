const { refreshTokenService } = require('../../services');
const { getValidRefreshToken, getExpiredRefreshToken, getInvalidRefreshToken } = require('../utils/tokens');

const validRefreshToken = getValidRefreshToken();
const expiredRefreshToken = getExpiredRefreshToken();
const invalidRefreshToken = getInvalidRefreshToken();

describe('Test refreshToken service', () => {
  describe('sign', () => {
    test('throws an error if `sub` object property does not exist', () => {
      const payload = {};
      expect(() => {
        refreshTokenService.sign(payload);
      }).toThrow();
    });
  });

  describe('validateAndReturnDecodedToken', () => {
    test('throws an error if the refresh token is not valid', () => {
      const invalidRefreshTokens = [
        null,
        '',
        'invalid-refresh-token',
        `${invalidRefreshToken}`,
        `${expiredRefreshToken}`,
      ];
      invalidRefreshTokens.forEach((token) => {
        expect(() => {
          refreshTokenService.validateAndReturnDecodedToken(token);
        }).toThrow('Invalid refresh token');
      });
    });

    test('should returns the decoded refresh token if it is valid', () => {
      const decodedToken = refreshTokenService.validateAndReturnDecodedToken(validRefreshToken);
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