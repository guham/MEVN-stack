const request = require('../supertest');
const app = require('../../app');
const db = require('../../db');
const { OAuth2Client } = require('google-auth-library');

beforeAll(async () => {
  // wait for DB connection to be up
  await request(app).get('/api/foo').authenticate();
});

afterAll(done => db.disconnect(done));

const getPayload = jest.fn(() => ({ sub: 123456 }));

OAuth2Client.prototype.verifyIdToken = jest.fn(() => Promise.resolve(({
  getPayload,
})));

describe('Test authentication routes', () => {
  describe('Test "/auth/token" path', () => {
    test('Should respond a JSON containing the JWT and the expiration date with status 200', async () => {
      const idToken = 'google-id-token';
      const verifyIdTokenOptions = {
        idToken,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
      };

      const response = await request(app).post('/auth/token').send({ idToken });
      expect(response.statusCode).toBe(200);
      expect(Object.keys(response.body)).toEqual(['token', 'tokenExpiration']);
      expect(response.body.token).not.toBeNull();
      expect(response.body.tokenExpiration).not.toBeNull();
      expect(OAuth2Client.prototype.verifyIdToken).toHaveBeenCalledWith(verifyIdTokenOptions);
    });
  });
});
