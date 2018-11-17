const { logger } = require('../../src/components');

describe('Test logger component', () => {
  test('Should be a function', () => {
    expect(typeof logger).toBe('function');
  });
});
