const debug = require('../../../src/utils/debug');

const parameters = {
  app: {
    isInEnv: jest.fn(),
  },
};

describe('Test debugging utility', () => {
  test('Should be disabled in test env', () => {
    parameters.app.isInEnv.mockReturnValueOnce(true);
    const { enabled } = debug({ parameters })('test');
    expect(enabled).toBeFalsy();
    expect(parameters.app.isInEnv).toHaveBeenCalledWith('test');
  });

  test('Should be enabled otherwise', () => {
    parameters.app.isInEnv.mockReturnValueOnce(false);
    const { enabled } = debug({ parameters })('dev-or-prod');
    expect(enabled).toBeTruthy();
    expect(parameters.app.isInEnv).toHaveBeenCalledWith('test');
  });
});
