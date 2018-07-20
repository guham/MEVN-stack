const { authenticate } = require('../../middlewares/authHandlers');
const { generateJwt } = require('../../services/auth');

let req;
let res;
let next;

beforeEach(() => {
  jest.clearAllMocks();
  req = {};
  res = {
    body: null,
    statusCode: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
    },
  };
  next = jest.fn();
});

describe('Test middleware authentication handlers', () => {
  describe('authenticate middleware', () => {
    test('calls next() with an error object if the request does not have an authorization header', () => {
      const error = new Error('Authorization header is required.');
      authenticate(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      req.headers = {};
      authenticate(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('calls next() with a valid JWT', () => {
      const userPayload = {
        sub: 123456,
      };
      const token = generateJwt(userPayload);

      req.headers = {
        authorization: `Bearer ${token}`,
      };
      authenticate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('should respond with a 401 with an invalid auth header', () => {
      req.headers = {
        authorization: 'invalid-auth-header',
      };
      authenticate(req, res, next);
      expect(res.statusCode).toBe(401);
    });

    test('should respond with a 401 with an expirated JWT', () => {
      // { uid: '123456', iat: 1530490533, exp: 1530497733, iss: 'accounts.google.com' }
      // exp = iat + 2h
      // secret = process.env.JWT_SECRET_KEY
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxMjM0NTYiLCJpYXQiOjE1MzA0OTA1MzMsImV4cCI6MTUzMDQ5NzczMywiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSJ9.u3yLEHFhWnHZsV-nYx8b6SdW09IuVzMKQIDC2R9Uvf0';
      req.headers = {
        authorization: `Bearer ${token}`,
      };
      authenticate(req, res, next);
      expect(res.statusCode).toBe(401);
    });
  });
});
