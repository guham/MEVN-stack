let container;
let parameters;

const init = (env = 'test') => {
  process.env.NODE_ENV = env;
  jest.resetModules();
  container = require('../../../src/container');
  parameters = container.resolve('parameters');
};

describe('Test API parameters', () => {
  describe('In all environments', () => {
    beforeAll(() => {
      init('test');
    });

    test('Parameters module should be an object', () => {
      expect(typeof parameters).toBe('object');
      expect(Object.keys(parameters).sort()).toEqual(['app', 'db', 'auth'].sort());
    });

    test('`app` property', () => {
      // "app" property
      expect(Object.keys(parameters.app).sort()).toEqual(['env', 'host', 'port', 'isInEnv', 'httpLogs'].sort());
      // "app" object properties
      expect(parameters.app.env).toBe(process.env.NODE_ENV);
      expect(parameters.app.host).toBe(process.env.HOST);
      expect(parameters.app.port).toBe(process.env.PORT);
      expect(typeof parameters.app.isInEnv).toBe('function');
      expect(parameters.app.isInEnv(process.env.NODE_ENV)).toBeTruthy();
    });

    test('`db` property', () => {
      expect(Object.keys(parameters.db)).toEqual(['uri']);
    });

    test('`auth` property', () => {
      expect(Object.keys(parameters.auth).sort()).toEqual([
        'clientId',
        'accessTokenSecretKey',
        'accessTokenExpiresIn',
        'refreshTokenSecretKey',
        'refreshTokenExpiresIn',
        'jwtIssuer',
      ].sort());
      // "auth" object properties
      expect(parameters.auth.clientId).toBe(process.env.GOOGLE_OAUTH_CLIENT_ID);
      expect(parameters.auth.accessTokenSecretKey).toBe(process.env.ACCESS_TOKEN_SECRET_KEY);
      expect(parameters.auth.accessTokenExpiresIn).toBe(process.env.ACCESS_TOKEN_EXPIRES_IN);
      expect(parameters.auth.refreshTokenSecretKey).toBe(process.env.REFRESH_TOKEN_SECRET_KEY);
      expect(parameters.auth.refreshTokenExpiresIn).toBe(process.env.REFRESH_TOKEN_EXPIRES_IN);
      expect(parameters.auth.jwtIssuer).toBe(process.env.JWT_ISSUER);
    });
  });

  describe('In test mode', () => {
    beforeAll(() => {
      init('test');
    });

    test('Database URI property should be equal to `MONGODB_URI_TEST` env variable', () => {
      expect(parameters.db.uri).toBe(process.env.MONGODB_URI_TEST);
    });

    test('HTTP logs property should be equal to `/api/tests/access.log`', () => {
      expect(parameters.app.httpLogs).toBe('/api/tests/access.log');
    });
  });

  describe('In development mode', () => {
    beforeAll(() => {
      init('development');
    });

    test('Database URI property should be equal to `MONGODB_URI` env variable', () => {
      expect(parameters.db.uri).toBe(process.env.MONGODB_URI);
    });

    test('HTTP logs property should be null', () => {
      expect(parameters.app.httpLogs).toBeNull();
    });
  });

  describe('In production mode', () => {
    beforeAll(() => {
      init('production');
    });

    test('Database URI property should be equal to `MONGODB_URI` env variable', () => {
      expect(parameters.db.uri).toBe(process.env.MONGODB_URI);
    });

    test('HTTP logs property should be null', () => {
      expect(parameters.app.httpLogs).toBeNull();
    });
  });
});
