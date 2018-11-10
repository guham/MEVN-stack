const createError = require('http-errors');
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
      invalidRefreshTokens.forEach((token) => {
        expect(() => {
          refreshTokenService.validateAndVerifyRefreshToken(token);
        }).toThrow(error);
      });
    });

    test('should returns the decoded refresh token if it is valid', () => {
      const decodedToken = refreshTokenService.validateAndVerifyRefreshToken(validRefreshToken);
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
