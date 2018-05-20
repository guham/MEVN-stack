let { parameters } = require('../../parameters');

describe('Test API parameters', () => {
  test('Parameters module should be an object', () => {
    expect(typeof parameters).toBe('object');
    expect(Object.keys(parameters).sort()).toEqual(['app', 'db'].sort());
    // "app" property
    expect(Object.keys(parameters.app).sort()).toEqual(['env', 'host', 'port', 'isInEnv'].sort());
    // "app" object properties
    expect(parameters.app.env).toBe(process.env.NODE_ENV);
    expect(parameters.app.host).toBe(process.env.HOST);
    expect(parameters.app.port).toBe(process.env.PORT);
    expect(typeof parameters.app.isInEnv).toBe('function');
    expect(parameters.app.isInEnv(process.env.NODE_ENV)).toBeTruthy();
    // "db" property
    expect(Object.keys(parameters.db)).toEqual(['uri']);
    // "db" object properties
    expect(parameters.db.uri).toBe(process.env.MONGODB_URI_TEST);
  });

  describe('In test mode', () => {
    test('Database URI property should be equal to "MONGODB_URI_TEST" env variable', () => {
      expect(parameters.db.uri).toBe(process.env.MONGODB_URI_TEST);
    });
  });

  describe('In development & production mode', () => {
    test('Database URI property should be equal to "MONGODB_URI" env variable', () => {
      process.env.NODE_ENV = 'development';
      jest.resetModules();
      ({ parameters } = require('../../parameters'));
      expect(parameters.db.uri).toBe(process.env.MONGODB_URI);
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      ({ parameters } = require('../../parameters'));
      expect(parameters.db.uri).toBe(process.env.MONGODB_URI);
    });
  });
});
