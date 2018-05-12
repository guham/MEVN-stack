const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const debug = require('debug')
// disable app logs
debug.disable()

describe('Test API routes', () => {
  afterAll(done => {
    mongoose.disconnect(done)
  })

  describe('Test "/api/foo" path', () => {
    test('Should respond an object with a 200', async () => {
      const response = await request(app).get('/api/foo')
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data')
      expect(typeof response.body.data).toBe('number')
    })
  })

  describe('Test "/api/foo/add" path', () => {
    test('Should respond an object with a 201', async () => {
      const response = await request(app).get('/api/foo/add')
      expect(response.statusCode).toBe(201)
      expect(Object.keys(response.body.data).sort()).toEqual(
        ['name', 'createdAt', 'updatedAt', '__v', '_id'].sort()
      )
    })
  })

  describe('Test "/api/foo/throw-exception" path', () => {
    test('Should respond with a 500', async () => {
      const response = await request(app).get('/api/foo/throw-exception')
      expect(response.statusCode).toBe(500)
    })
  })

  describe('Test "/api/foo/test" path', () => {
    test('Should respond an object with a 200', async () => {
      const response = await request(app).get('/api/foo/test')
      expect(response.statusCode).toBe(200)
      expect(typeof response.body.value).toBe('string')
      expect(response.body.value).toMatch(/.*/)
    })
  })
})
