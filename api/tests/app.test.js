const request = require('supertest');
const app = require('../app');
const db = require('../db');

beforeAll(async () => {
  // wait for DB connection to be up
  await request(app).get('/api/foo');
});

afterAll(done => db.disconnect(done));

function getLayerByName(name) {
  return app._router.stack.find(layer => layer.name === name);
}

describe('Test app', () => {
  test('Should use json parser', () => {
    const jsonParser = getLayerByName('jsonParser');
    expect(jsonParser).toBeDefined();
  });

  test('Should use cors middleware', () => {
    const corsMiddleware = getLayerByName('corsMiddleware');
    expect(corsMiddleware).toBeDefined();
  });

  test('Should use cookie parser', () => {
    const cookieParser = getLayerByName('cookieParser');
    expect(cookieParser).toBeDefined();
  });

  test('Should use logger', () => {
    const logger = getLayerByName('logger');
    expect(logger).toBeDefined();
  });
});
