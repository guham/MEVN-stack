const debug = require('../../components/debug')('env-test');

describe('Test debug component', () => {
  test('Should be disabled in test env', () => {
    expect(debug.enabled).toBeFalsy();
  });
});
