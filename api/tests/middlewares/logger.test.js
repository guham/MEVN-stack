const { logger } = require('../../src/middlewares');

describe('Test logger middleware', () => {
  test('Should be a function', () => {
    expect(typeof logger).toBe('function');
  });
});
