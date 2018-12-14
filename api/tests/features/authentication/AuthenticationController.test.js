const { OAuth2Client } = require('google-auth-library');
const request = require('../../request');
const { getDefaultUserPayload } = require('../../tokens');

describe('Test authentication routes', () => {
  describe('Test "/auth/tokens" path', () => {
    test('Should respond a JSON containing the access token, a refresh token and the expiration date with status 200', async () => {
      OAuth2Client.prototype.verifyIdToken = jest.fn(() => Promise.resolve(({
        getPayload: jest.fn(() => (getDefaultUserPayload())),
      })));
      const idToken = 'google-id-token';

      const response = await request().post('/auth/tokens').send({ idToken }).expect(200);
      expect(Object.keys(response.body)).toEqual(['accessToken', 'refreshToken', 'expirationDate']);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.expirationDate).toBeDefined();
    });

    test('Should return the error with status 500 if something wrong happens', async () => {
      OAuth2Client.prototype.verifyIdToken = jest.fn(() => Promise.reject(new Error('Some authentication error')));
      const idToken = 'google-id-token';

      const response = await request().post('/auth/tokens').send({ idToken }).expect(500);
      expect(response.body.message).toBe('Some authentication error');
    });
  });
});
