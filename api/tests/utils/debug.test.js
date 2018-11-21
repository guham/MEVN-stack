const debug = require('../../src/utils/debug')('env-test');

describe('Test debugging utility', () => {
  test('Should be disabled in test env', () => {
    expect(debug.enabled).toBeFalsy();
  });
});
