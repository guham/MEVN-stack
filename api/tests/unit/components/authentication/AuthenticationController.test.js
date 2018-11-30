const createError = require('http-errors');
const authenticationController = require('../../../../src/components/authentication/AuthenticationController');
const {
  getValidAccessToken,
  getInvalidRefreshToken,
  getValidRefreshToken,
} = require('../../../tokens');

let req;
let res;
let next;
const usersService = {
  findOne: jest.fn(),
  removeUserRefreshToken: jest.fn(),
  storeUserRefreshToken: jest.fn(),
};
const authenticationService = {
  retrieveDecodedAccessToken: jest.fn(),
  retrieveDecodedRefreshToken: jest.fn(),
  validateAndVerifyRefreshToken: jest.fn(),
  createAndReturnTokens: jest.fn(),
};

beforeEach(() => {
  req = {};
  res = {
    json: jest.fn(),
  };
  next = jest.fn();
});

describe('Test Authentication controller', () => {
  describe('refreshTokens', () => {
    test('calls next() with an error object if the request doesn\'t have a valid access token', async () => {
      authenticationService.retrieveDecodedAccessToken.mockImplementation(() => Promise.reject(new Error()));
      const controller = authenticationController({ usersService, authenticationService });
      req.headers = {
        authorization: 'invalid-auth-header',
      };
      await controller.refreshTokens(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    test('calls next() with an error object if the request doesn\'t have a valid and not expired refresh token', async () => {
      authenticationService.retrieveDecodedAccessToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '123456',
        },
      }));
      authenticationService.validateAndVerifyRefreshToken.mockImplementation(() => Promise.reject(new Error()));
      const controller = authenticationController({ usersService, authenticationService });
      req.headers = {
        authorization: `Bearer ${await getValidAccessToken()}`,
      };
      req.body = {
        refreshToken: getInvalidRefreshToken(),
      };

      await controller.refreshTokens(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    test('calls res.json() with new tokens if the request has a valid access token and a valid and not expired refresh token', async () => {
      authenticationService.retrieveDecodedAccessToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '123456',
        },
      }));
      authenticationService.validateAndVerifyRefreshToken.mockImplementation(() => Promise.resolve({
        uid: '123456',
      }));
      const tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        expirationDate: 'expiration_date',
      };
      const user = { sub: '123456' };
      authenticationService.createAndReturnTokens.mockImplementation(() => Promise.resolve(tokens));
      usersService.findOne.mockImplementation(() => Promise.resolve(user));
      usersService.removeUserRefreshToken.mockImplementation(() => Promise.resolve(true));
      usersService.storeUserRefreshToken.mockImplementation(() => Promise.resolve(user));

      const controller = authenticationController({ usersService, authenticationService });
      req.headers = {
        authorization: `Bearer ${await getValidAccessToken()}`,
      };
      req.body = {
        refreshToken: await getValidRefreshToken(),
      };

      await controller.refreshTokens(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('userSignOut', () => {
    test('calls next() with an error object if the request doesn\'t have a valid access token', async () => {
      authenticationService.retrieveDecodedAccessToken.mockImplementation(() => Promise.reject(new Error()));
      const controller = authenticationController({ usersService, authenticationService });
      req.headers = {
        authorization: 'invalid-auth-header',
      };
      await controller.userSignOut(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    test('calls next() with an error object if the request doesn\'t have a valid refresh token', async () => {
      authenticationService.retrieveDecodedAccessToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '123456',
        },
      }));
      authenticationService.retrieveDecodedRefreshToken.mockImplementation(() => Promise.reject(new Error()));
      const controller = authenticationController({ usersService, authenticationService });
      req.headers = {
        authorization: `Bearer ${await getValidAccessToken()}`,
      };
      req.body = {
        refreshToken: 'invalid-refresh-token',
      };

      await controller.userSignOut(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    test('calls next() with an error 401 if the refresh token\'s user is not equal to the access token\'s user', async () => {
      authenticationService.retrieveDecodedAccessToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '123456',
        },
      }));
      authenticationService.retrieveDecodedRefreshToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '789',
        },
      }));
      const controller = authenticationController({ usersService, authenticationService });
      req.headers = {
        authorization: `Bearer ${await getValidAccessToken()}`,
      };
      req.body = {
        refreshToken: await getValidRefreshToken({ sub: '12' }), // valid or not refresh token
      };

      await controller.userSignOut(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof createError.Unauthorized).toBeTruthy();
    });

    test('calls next() with an error 401 if the user doesn\'t exist in database', async () => {
      authenticationService.retrieveDecodedAccessToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '123456',
        },
      }));
      authenticationService.retrieveDecodedRefreshToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '123456',
        },
      }));
      usersService.findOne.mockImplementation(() => Promise.resolve(undefined));
      const controller = authenticationController({ usersService, authenticationService });
      req.headers = {
        authorization: `Bearer ${await getValidAccessToken()}`,
      };
      req.body = {
        refreshToken: await getValidRefreshToken(), // valid or not refresh token
      };

      await controller.userSignOut(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof createError.Unauthorized).toBeTruthy();
    });

    test('calls next() with an error 401 if the refresh token does not belong to the user', async () => {
      authenticationService.retrieveDecodedAccessToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '123456',
        },
      }));
      authenticationService.retrieveDecodedRefreshToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '123456',
        },
      }));
      usersService.findOne.mockImplementation(() => Promise.resolve({ sub: '123456' }));
      usersService.removeUserRefreshToken.mockImplementation(() => Promise.resolve(false));
      const controller = authenticationController({ usersService, authenticationService });
      req.headers = {
        authorization: `Bearer ${await getValidAccessToken()}`,
      };
      req.body = {
        refreshToken: await getValidRefreshToken(), // valid or not refresh token
      };

      await controller.userSignOut(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof createError.Unauthorized).toBeTruthy();
    });

    test('calls res.json() with an empty object if the user can sign out successfully', async () => {
      authenticationService.retrieveDecodedAccessToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '123456',
        },
      }));
      authenticationService.retrieveDecodedRefreshToken.mockImplementation(() => Promise.resolve({
        payload: {
          uid: '123456',
        },
      }));
      usersService.findOne.mockImplementation(() => Promise.resolve({ sub: '123456' }));
      usersService.removeUserRefreshToken.mockImplementation(() => Promise.resolve(true));
      const controller = authenticationController({ usersService, authenticationService });
      req.headers = {
        authorization: `Bearer ${await getValidAccessToken()}`,
      };
      req.body = {
        refreshToken: await getValidRefreshToken(), // valid or not refresh token
      };

      await controller.userSignOut(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
