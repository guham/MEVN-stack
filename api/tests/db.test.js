const mongoose = require('mongoose');

let db;

beforeEach(() => {
  db = require('../db');
});

afterEach(async () => {
  await db.disconnect();
});

describe('Test database connection', () => {
  test('Successful DB connection should return DB instance', async () => {
    const database = await db.connect();
    expect(database instanceof mongoose.Mongoose).toBeTruthy();
    expect(db.mongoose.connection.readyState).toBeTruthy();
    expect(db.mongoose.connection.db).toBeDefined();
    expect(db.mongoose.connection.config).toHaveProperty('autoIndex');
  });

  test('Failed DB connection should return error object', async () => {
    const env = process.env.MONGODB_URI_TEST;
    process.env.MONGODB_URI_TEST = 'mongodb://unknownuser:123456@db:27017/unknowndb';
    jest.resetModules();
    db = require('../db');
    const error = await db.connect();
    expect(error.name).toBe('MongoError');
    expect(error.message).toBe('Authentication failed.');
    process.env.MONGODB_URI_TEST = env;
    jest.resetModules();
  });

  describe('In test mode', () => {
    test('The name of the database should be "test"', async () => {
      await db.connect();
      expect(db.mongoose.connection.name).toBe('test');
    });

    test('Option "autoIndex" should be false', async () => {
      await db.connect();
      expect(db.mongoose.connection.config.autoIndex).toBeFalsy();
    });
  });

  describe('In development mode', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
      jest.resetModules();
      db = require('../db');
    });

    test('The name of the database should be equal to "MONGO_INITDB_DATABASE" env variable', async () => {
      const name = process.env.MONGO_INITDB_DATABASE;
      await db.connect();
      expect(db.mongoose.connection.name).toBe(name);
    });

    test('Option "autoIndex" should be true', async () => {
      await db.connect();
      expect(db.mongoose.connection.config.autoIndex).toBeTruthy();
    });
  });

  describe('In production mode', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      db = require('../db');
    });

    test('The name of the database should be equal to "MONGO_INITDB_DATABASE" env variable', async () => {
      const name = process.env.MONGO_INITDB_DATABASE;
      await db.connect();
      expect(db.mongoose.connection.name).toBe(name);
    });

    test('Option "autoIndex" should be false', async () => {
      await db.connect();
      expect(db.mongoose.connection.config.autoIndex).toBeFalsy();
    });
  });
});
