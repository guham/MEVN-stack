const request = require('../../supertest');
const db = require('../../../src/db');

afterAll(done => db.disconnect(done));

describe('Test API routes', () => {
  describe('Test "/api/foos" path', () => {
    test('Should respond an array of objects with a 200', async () => {
      const response = await request().get('/api/foos').authenticate();
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('Test "/api/foos/add" path', () => {
    test('Should respond an object with a 201', async () => {
      const response = await request().post('/api/foos/add').send({ name: 'foo' }).authenticate();
      expect(response.statusCode).toBe(201);
      expect(Object.keys(response.body).sort()).toEqual(['name', 'createdAt', 'updatedAt', '__v', '_id'].sort());
    });
  });

  describe('Test "/api/foos/:id" path', () => {
    test('Should respond with a 500 with a malformed id', async () => {
      const response = await request().get('/api/foos/42').authenticate();
      expect(response.statusCode).toBe(500);
    });

    test('Should respond with a 200 with valid id but foo does not exist', async () => {
      const response = await request().get('/api/foos/5bfe0af364e3bf0830f649ba').authenticate();
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeNull();
    });

    test('Should respond with a 200 with an existing foo', async () => {
      // add foo
      let response = await request().post('/api/foos/add').send({ name: 'bar' }).authenticate();
      const foo = response.body;
      response = await request().get(`/api/foos/${foo._id}`).authenticate();
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(foo);
    });
  });

  describe('Test "/api/foos/test" path', () => {
    test('Should respond an object with a 200', async () => {
      const response = await request().get('/api/foos/test').authenticate();
      expect(response.statusCode).toBe(200);
      expect(typeof response.body.data).toBe('string');
      expect(response.body.data).toMatch(/.*/);
    });
  });
});
