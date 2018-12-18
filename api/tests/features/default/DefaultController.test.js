const request = require('../../request');

describe('Test default routes', () => {
  describe('Test `/` path', () => {
    test('returns an empty JSON with status 200', async () => {
      const { body } = await request().get('/').expect(200);
      expect(body).toEqual({});
    });
  });

  describe('Test `/undefined` path', () => {
    test('returns the not found error with status 404', async () => {
      const { body } = await request().get('/undefined').expect(404);
      expect(body).toEqual({
        type: 'NotFoundError',
        message: 'Not Found',
        error: {},
      });
    });
  });

  describe('Test `/favicon.ico` path', () => {
    test('should respond with a 204', async () => {
      await request().get('/favicon.ico').expect(204);
    });
  });
});
