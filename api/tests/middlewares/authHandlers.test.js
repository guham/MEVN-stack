const { authenticate } = require('../../src/middlewares/authHandlers');
const { getValidAccessToken, getExpiredAccessToken } = require('../utils/tokens');

let req;
let res;
let next;

beforeEach(() => {
  req = {};
  res = {};
  next = jest.fn();
});

describe('Test middleware authentication handlers', () => {
  describe('authenticate middleware', () => {
    test('calls next() with an error object if the request doesn\'t have an authorization header', () => {
      const error = new Error('No authorization token was found');
      authenticate(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      req.headers = {};
      authenticate(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].status).toBe(401);
    });

    test('sets the req.user attribute if the authorization header contains a valid access token', async (done) => {
      const token = await getValidAccessToken();
      req.headers = {
        authorization: `Bearer ${token}`,
      };

      next = (error) => {
        expect(error).toBeFalsy();
        expect(typeof req.user).toBe('object');
        expect(req.user.uid).toBe('123456');
        done();
      };

      authenticate(req, res, next);
    });

    test('calls next() with an error object if the request has an invalid authorization header', () => {
      const error = new Error('Format is Authorization: Bearer [token]');

      req.headers = {
        authorization: 'invalid-auth-header',
      };

      authenticate(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].status).toBe(401);
    });

    test('throws an error if the authorization header contains an expired access token', (done) => {
      const token = getExpiredAccessToken();
      req.headers = {
        authorization: `Bearer ${token}`,
      };

      next = (error) => {
        expect(error).toBeTruthy();
        expect(error.name).toBe('UnauthorizedError');
        expect(error.message).toBe('jwt expired');
        expect(error.status).toBe(401);
        done();
      };

      authenticate(req, res, next);
    });
  });
});
