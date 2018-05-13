let app;
let logger;
let env;
let mongoose;
let debug;

beforeEach(() => {
  env = process.env.NODE_ENV;
  jest.resetModules();
  mongoose = require('mongoose');
  debug = require('debug');
  // disable app logs
  debug.disable();
});

afterEach((done) => {
  process.env.NODE_ENV = env;
  mongoose.disconnect(done);
});

afterAll((done) => {
  mongoose.disconnect(done);
});

function createApp(mode) {
  process.env.NODE_ENV = mode;
  app = require('../app');
  logger = app._router.stack.find(layer => layer.name === 'logger');
}

describe('Test app', () => {
  describe('In development mode', () => {
    beforeEach(() => {
      createApp('development');
    });

    test('Should use logger', () => {
      expect(logger).toBeDefined();
    });
  });

  describe('In test mode', () => {
    beforeEach(() => {
      createApp('test');
    });

    test('Should not use logger', () => {
      expect(logger).not.toBeDefined();
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
