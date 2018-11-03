const { authController } = require('../../controllers');
const { getDefaultUserPayload } = require('../utils/tokens');
const {
  getValidAccessToken,
  getInvalidRefreshToken,
  getValidRefreshToken,
} = require('../utils/tokens');

let req;
let res;
let next;

beforeEach(() => {
  req = {};
  res = {
    json: jest.fn(),
  };
  next = jest.fn();
});

describe('Test authentication controller', () => {
  describe('createAndReturnTokens', () => {
    test('throws an error if `sub` object property does not exist', () => {
      const payload = {};
      expect(() => {
        authController.createAndReturnTokens(payload);
      }).toThrow();
    });

    test('returns an object which contains access & refresh tokens and the access token expiration date', () => {
      const payload = getDefaultUserPayload();
      const tokens = authController.createAndReturnTokens(payload);
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.expirationDate).toBeDefined();
    });
  });

  describe('refreshTokens', () => {
    test('calls next() with an error object if the request doesn\'t have a valid access token', () => {
      req.headers = {
        authorization: 'invalid-auth-header',
      };
      authController.refreshTokens(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    test('calls next() with an error object if the request doesn\'t have a valid and not expired refresh token', () => {
      req.headers = {
        authorization: `Bearer ${getValidAccessToken()}`,
      };
      req.body = {
        refreshToken: getInvalidRefreshToken(),
      };

      authController.refreshTokens(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    test('calls res.json() with new tokens if the request has a valid access token and a valid and not expired refresh token', () => {
      req.headers = {
        authorization: `Bearer ${getValidAccessToken()}`,
      };
      req.body = {
        refreshToken: getValidRefreshToken(),
      };

      authController.refreshTokens(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
