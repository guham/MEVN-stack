const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/db');

afterAll(done => db.disconnect(done));

describe('Test default routes', () => {
  describe('Test "/" path', () => {
    test('Should respond "Home" with a 200', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({});
    });
  });

  describe('Test "/undefined" path', () => {
    test('Should respond with a 404', async () => {
      const response = await request(app).get('/undefined');
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        type: 'NotFoundError',
        message: 'Not Found',
        error: {},
      });
    });
  });

  describe('Test "/favicon.ico" path', () => {
    test('Should respond with a 204', async () => {
      const response = await request(app).get('/favicon.ico');
      expect(response.statusCode).toBe(204);
    });
  });
});
