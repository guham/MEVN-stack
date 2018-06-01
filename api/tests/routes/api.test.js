const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

beforeAll(async () => {
  db.mongoose.connection.on('open', async () => {
    const collections = await db.mongoose.connection.db.collections();
    return Promise.all(collections.map(collection => collection.drop()));
  });
});

afterAll((done) => {
  db.disconnect(done);
});

describe('Test API routes', () => {
  describe('Test "/api/foo" path', () => {
    test('Should respond an array of objects with a 200', async () => {
      const response = await request(app).get('/api/foo');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('Test "/api/foo/add" path', () => {
    test('Should respond an object with a 201', async () => {
      const response = await request(app).post('/api/foo/add').send({ name: 'new foo' });
      expect(response.statusCode).toBe(201);
      expect(Object.keys(response.body).sort()).toEqual(['name', 'createdAt', 'updatedAt', '__v', '_id'].sort());
    });
  });

  describe('Test "/api/foo/ID" path', () => {
    test('Should respond with a 500 with a malformed id', async () => {
      const response = await request(app).get('/api/foo/42');
      expect(response.statusCode).toBe(500);
    });

    test('Should respond with a 200 with valid id but foo does not exist', async () => {
      const response = await request(app).get('/api/foo/5bfe0af364e3bf0830f649ba');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeNull();
    });

    test('Should respond with a 200 with an existing foo', async () => {
      // add foo
      let response = await request(app).post('/api/foo/add').send({ name: 'new foo' });
      const foo = response.body;
      response = await request(app).get(`/api/foo/${foo._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(foo);
    });
  });

  describe('Test "/api/foo/test" path', () => {
    test('Should respond an object with a 200', async () => {
      const response = await request(app).get('/api/foo/test');
      expect(response.statusCode).toBe(200);
      expect(typeof response.body.data).toBe('string');
      expect(response.body.data).toMatch(/.*/);
    });
  });
});
