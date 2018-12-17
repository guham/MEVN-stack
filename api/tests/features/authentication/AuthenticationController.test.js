const { OAuth2Client } = require('google-auth-library');
const request = require('../../request');
const factory = require('../../factory');
const {
  getDefaultUserPayload,
  getValidRefreshToken,
  getExpiredRefreshToken,
} = require('../../tokens');

describe('Test authentication routes', () => {
  describe('Test `/auth/tokens` path', () => {
    test('Should respond a JSON containing the access token, a refresh token and the expiration date with status 200', async () => {
      OAuth2Client.prototype.verifyIdToken = jest.fn(() => Promise.resolve(({
        getPayload: jest.fn(() => (getDefaultUserPayload())),
      })));
      const idToken = 'google-id-token';

      const { body } = await request().post('/auth/tokens').send({ idToken }).expect(200);
      expect(Object.keys(body)).toEqual(['accessToken', 'refreshToken', 'expirationDate']);
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
      expect(body.expirationDate).toBeDefined();
    });

    test('Should return the error with status 500 if something wrong happens', async () => {
      OAuth2Client.prototype.verifyIdToken = jest.fn(() => Promise.reject(new Error('Some authentication error')));
      const idToken = 'google-id-token';

      const { body } = await request().post('/auth/tokens').send({ idToken }).expect(500);
      expect(body.message).toBe('Some authentication error');
    });
  });

  describe('Test `/auth/refreshTokens` path', () => {
    test('returns the error message and status 401 if the access token is missing', async () => {
      const { body, statusCode } = await request().post('/auth/refreshTokens').send();
      expect(statusCode).toBe(401);
      expect(body.type).toBe('UnauthorizedError');
      expect(body.message).toBe('Format is Authorization: Bearer [token]');
    });

    test('returns the invalid refresh token message and status 401 if the refresh token is missing', async () => {
      const { body, statusCode } = await request().post('/auth/refreshTokens').send().authenticate();
      expect(statusCode).toBe(401);
      expect(body.type).toBe('UnauthorizedError');
      expect(body.message).toBe('Invalid refresh token');
    });

    test('returns the invalid refresh token message and status 401 if the refresh token is invalid', async () => {
      const refreshToken = getExpiredRefreshToken();
      const { body, statusCode } = await request().post('/auth/refreshTokens').send({ refreshToken }).authenticate();
      expect(statusCode).toBe(401);
      expect(body.type).toBe('UnauthorizedError');
      expect(body.message).toBe('Invalid refresh token');
    });

    test('returns the unauthorized message and status 401 if the refresh token\'s user is not equal to the access token user', async () => {
      const refreshToken = await getValidRefreshToken({ sub: '2' });
      const { body, statusCode } = await request().post('/auth/refreshTokens').send({ refreshToken }).authenticate();
      expect(statusCode).toBe(401);
      expect(body.type).toBe('UnauthorizedError');
      expect(body.message).toBe('Unauthorized');
    });

    test('returns the not found message and status 401 if the user is not found in DB', async () => {
      const refreshToken = await getValidRefreshToken();
      const { body, statusCode } = await request().post('/auth/refreshTokens').send({ refreshToken }).authenticate();
      expect(statusCode).toBe(401);
      expect(body.type).toBe('UnauthorizedError');
      expect(body.message).toBe('User not found');
    });

    test('returns the refresh token not found message and status 401 if the refresh token does not belong to the user', async () => {
      await factory.create('user', {
        ...getDefaultUserPayload(),
      });
      const refreshToken = await getValidRefreshToken();
      const { body, statusCode } = await request().post('/auth/refreshTokens').send({ refreshToken }).authenticate();
      expect(statusCode).toBe(401);
      expect(body.type).toBe('UnauthorizedError');
      expect(body.message).toBe('Refresh token not found');
    });

    test('returns a JSON containing the access token, a refresh token and the expiration date with status 200', async () => {
      const refreshToken = await getValidRefreshToken();
      await factory.create('user', {
        ...getDefaultUserPayload(),
        refreshTokens: new Map([[new Date().getTime().toString(), refreshToken]]),
      });
      const { body, statusCode } = await request().post('/auth/refreshTokens').send({ refreshToken }).authenticate();
      expect(statusCode).toBe(200);
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
      expect(body.expirationDate).toBeDefined();
    });
  });
});
