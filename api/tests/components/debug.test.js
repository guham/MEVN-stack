const debug = require('../../src/components/debug')('env-test');

describe('Test debug component', () => {
  test('Should be disabled in test env', () => {
    expect(debug.enabled).toBeFalsy();
  });
});
