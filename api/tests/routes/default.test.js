const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const debug = require('debug');
// disable app logs
debug.disable();

describe('Test default routes', () => {
  afterAll((done) => {
    mongoose.disconnect(done);
  });

  describe('Test "/" path', () => {
    test('Should respond "Home" with a 200', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Home');
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
});
