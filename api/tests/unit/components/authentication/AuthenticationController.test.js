const createError = require('http-errors');
const authenticationController = require('../../../../src/components/authentication/AuthenticationController');
const {
  getDefaultUserPayload,
  getValidAccessToken,
  getDecodedAccessToken,
  getInvalidRefreshToken,
  getValidRefreshToken,
  getVerifiedRefreshToken,
} = require('../../../tokens');

let req;
let res;
let next;
let usersService;
let authenticationService;

beforeEach(async () => {
  const decodedAccessToken = await getDecodedAccessToken();
  const verifiedRefreshToken = await getVerifiedRefreshToken();
  usersService = {
    findOne: jest.fn(),
    removeUserRefreshToken: jest.fn(),
    storeUserRefreshToken: jest.fn(),
  };
  authenticationService = {
    retrieveDecodedAccessToken: jest.fn(() => Promise.resolve(decodedAccessToken)),
    retrieveDecodedRefreshToken: jest.fn(() => Promise.resolve(decodedAccessToken)),
    validateAndVerifyRefreshToken: jest.fn(() => Promise.resolve(verifiedRefreshToken)),
    createAndReturnTokens: jest.fn(),
    verifyIdToken: jest.fn(),
  };
  req = {
    headers: {
      authorization: `Bearer ${await getValidAccessToken()}`,
    },
  };
  res = {
    json: jest.fn(),
  };
  next = jest.fn();
});

describe('Test Authentication controller', () => {
  describe('refreshTokens', () => {
    test('calls next() with an error object if the request doesn\'t have a valid access token', async () => {
      req.headers = {
        authorization: 'invalid-auth-header',
      };
      authenticationService.retrieveDecodedAccessToken.mockImplementationOnce(() => Promise.reject(new Error()));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.refreshTokens(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    test('calls next() with an error object if the request doesn\'t have a valid and not expired refresh token', async () => {
      req.body = {
        refreshToken: getInvalidRefreshToken(),
      };
      authenticationService.validateAndVerifyRefreshToken.mockImplementationOnce(() => Promise.reject(new Error()));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.refreshTokens(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    test('calls next() with an error object if the refresh token\'s user is not equal to the access token user', async () => {
      const differentUser = { sub: '2' };
      req.body = {
        refreshToken: getValidRefreshToken(differentUser),
      };
      authenticationService.validateAndVerifyRefreshToken.mockImplementationOnce(() => Promise.resolve(getVerifiedRefreshToken(differentUser)));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.refreshTokens(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof createError.HttpError).toBeTruthy();
    });

    test('calls next() with an error object if the user does not exist in database', async () => {
      req.body = {
        refreshToken: await getValidRefreshToken(),
      };
      usersService.findOne.mockImplementation(() => Promise.resolve(null));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.refreshTokens(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof createError.HttpError).toBeTruthy();
    });

    test('calls next() with an error object if the refresh token does not belong to the user', async () => {
      req.body = {
        refreshToken: await getValidRefreshToken(),
      };
      usersService.findOne.mockImplementation(() => Promise.resolve(getDefaultUserPayload()));
      usersService.removeUserRefreshToken.mockImplementation(() => Promise.resolve(false));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.refreshTokens(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof createError.HttpError).toBeTruthy();
    });

    test('calls res.json() with new tokens if the request has a valid access token and a valid and not expired refresh token', async () => {
      req.body = {
        refreshToken: await getValidRefreshToken(),
      };
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

      await controller.refreshTokens(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('userSignOut', () => {
    test('calls next() with an error object if the request doesn\'t have a valid access token', async () => {
      req.headers = {
        authorization: 'invalid-auth-header',
      };
      authenticationService.retrieveDecodedAccessToken.mockImplementationOnce(() => Promise.reject(new Error()));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.userSignOut(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    test('calls next() with an error object if the request doesn\'t have a valid refresh token', async () => {
      req.body = {
        refreshToken: 'invalid-refresh-token',
      };
      authenticationService.retrieveDecodedRefreshToken.mockImplementationOnce(() => Promise.reject(new Error()));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.userSignOut(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    test('calls next() with an error object if the refresh token\'s user is not equal to the access token\'s user', async () => {
      req.body = {
        refreshToken: await getValidRefreshToken({ sub: '12' }), // valid or not refresh token
      };
      authenticationService.retrieveDecodedRefreshToken.mockImplementationOnce(() => Promise.resolve({
        payload: {
          uid: '12',
        },
      }));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.userSignOut(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof createError.HttpError).toBeTruthy();
    });

    test('calls next() with an error object if the user doesn\'t exist in database', async () => {
      req.body = {
        refreshToken: await getValidRefreshToken(), // valid or not refresh token
      };
      usersService.findOne.mockImplementation(() => Promise.resolve(undefined));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.userSignOut(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof createError.HttpError).toBeTruthy();
    });

    test('calls next() with an error object if the refresh token does not belong to the user', async () => {
      req.body = {
        refreshToken: await getValidRefreshToken(), // valid or not refresh token
      };
      usersService.findOne.mockImplementation(() => Promise.resolve({ sub: '123456' }));
      usersService.removeUserRefreshToken.mockImplementation(() => Promise.resolve(false));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.userSignOut(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0] instanceof createError.HttpError).toBeTruthy();
    });

    test('calls res.json() with an empty object if the user can sign out successfully', async () => {
      req.body = {
        refreshToken: await getValidRefreshToken(), // valid or not refresh token
      };
      usersService.findOne.mockImplementation(() => Promise.resolve({ sub: '123456' }));
      usersService.removeUserRefreshToken.mockImplementation(() => Promise.resolve(true));
      const controller = authenticationController({ usersService, authenticationService });

      await controller.userSignOut(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
