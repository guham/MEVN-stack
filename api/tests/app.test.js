let app;
let logger;
let env;
let db;

afterEach((done) => {
  process.env.NODE_ENV = env;
  db.disconnect(done);
});

afterAll((done) => {
  db.disconnect(done);
});

function createApp(mode) {
  env = process.env.NODE_ENV;
  jest.resetModules();
  process.env.NODE_ENV = mode;
  app = require('../app');
  db = require('../db');
  logger = app._router.stack.find(layer => layer.name === 'logger');
}

describe('Test app', () => {
  describe('In test mode', () => {
    beforeEach(() => {
      createApp('test');
    });

    test('Should not use logger', () => {
      expect(logger).not.toBeDefined();
    });
  });

  describe('In development mode', () => {
    beforeEach(() => {
      createApp('development');
    });

    test('Should use logger', () => {
      expect(logger).toBeDefined();
    });
  });

  describe('In production mode', () => {
    beforeEach(() => {
      createApp('production');
    });

    test('Should use logger', () => {
      expect(logger).toBeDefined();
    });
  });
});
