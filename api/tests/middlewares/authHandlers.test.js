const { authenticate } = require('../../middlewares/authHandlers');
const { accessToken } = require('../../services');

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
    test('calls next() with an error object if the request does not have an authorization header', () => {
      const error = new Error('No authorization token was found');
      authenticate(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      req.headers = {};
      authenticate(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].status).toBe(401);
    });

    test('sets the req.user attribute if the authorization header contains a valid JWT', (done) => {
      const userPayload = {
        sub: 123456,
      };
      const token = accessToken(userPayload);

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      next = (error) => {
        expect(error).toBeFalsy();
        expect(typeof req.user).toBe('object');
        expect(req.user.uid).toBe(123456);
        done();
      };

      authenticate(req, res, next);
    });

    test('calls next() with an error object if the request have an invalid authorization header', () => {
      const error = new Error('Format is Authorization: Bearer [token]');

      req.headers = {
        authorization: 'invalid-auth-header',
      };

      authenticate(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].status).toBe(401);
    });

    test('throws an error if the authorization header contains an expirated JWT', (done) => {
      // { uid: '123456', iat: 1530490533, exp: 1530497733, iss: 'accounts.google.com' }
      // exp = iat + 2h
      // secret = process.env.ACCESS_TOKEN_SECRET_KEY
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxMjM0NTYiLCJpYXQiOjE1MzA0OTA1MzMsImV4cCI6MTUzMDQ5NzczMywiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSJ9.u3yLEHFhWnHZsV-nYx8b6SdW09IuVzMKQIDC2R9Uvf0';
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
