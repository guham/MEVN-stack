const request = require('../../supertest');
const db = require('../../../src/db');
const { OAuth2Client } = require('google-auth-library');

beforeAll(async () => {
  // wait for DB connection to be up
  await request().get('/api/foo').authenticate();
});

afterAll(done => db.disconnect(done));

const getPayload = jest.fn(() => ({ sub: '123456' }));

OAuth2Client.prototype.verifyIdToken = jest.fn(() => Promise.resolve(({
  getPayload,
})));

describe('Test authentication routes', () => {
  describe('Test "/auth/tokens" path', () => {
    test('Should respond a JSON containing the access token, a refresh token and the expiration date with status 200', async () => {
      const idToken = 'google-id-token';
      const verifyIdTokenOptions = {
        idToken,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
      };

      const response = await request().post('/auth/tokens').send({ idToken });
      expect(response.statusCode).toBe(200);
      expect(Object.keys(response.body)).toEqual(['accessToken', 'refreshToken', 'expirationDate']);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.expirationDate).toBeDefined();
      expect(OAuth2Client.prototype.verifyIdToken).toHaveBeenCalledWith(verifyIdTokenOptions);
    });
  });
});
