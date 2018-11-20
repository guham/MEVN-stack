const app = require('../src/app');

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

  test('Should use logger', () => {
    const logger = getLayerByName('logger');
    expect(logger).toBeDefined();
  });
});
