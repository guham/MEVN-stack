let app, logger, env, mongoose, debug

beforeEach(() => {
  env = process.env.NODE_ENV
  jest.resetModules()
  mongoose = require('mongoose')
  debug = require('debug')
  // disable app logs
  debug.disable()
})

afterEach(done => {
  process.env.NODE_ENV = env
  mongoose.disconnect(done)
})

afterAll(done => {
  mongoose.disconnect(done)
})

describe('Test app', () => {

  describe('In development mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
      app = require('../app')
      logger = app._router.stack.find(layer => layer.name === 'logger')
    })

    test('Should use logger', () => {
      expect(logger).toBeDefined()
    })
  })

  describe('In test mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test'
      app = require('../app')
      logger = app._router.stack.find(layer => layer.name === 'logger')
    })

    test('Should not use logger', () => {
      expect(logger).not.toBeDefined()
    })
  })

  describe('In production mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
      app = require('../app')
      logger = app._router.stack.find(layer => layer.name === 'logger')
    })

    test('Should use logger', () => {
      expect(logger).toBeDefined()
    })
  })
})
