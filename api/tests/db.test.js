let mongoose;
let container;
let db;

const connect = async (env = 'test') => {
  process.env.NODE_ENV = env;
  jest.resetModules();
  mongoose = require('mongoose');
  container = require('../src/container');
  db = container.resolve('db');
  await db.connect();
};

const disconnect = async (done) => {
  await db.disconnect(done);
};

afterAll(async done => disconnect(done));

describe('Test database connection', () => {
  test('DB instance is available on successful DB connection', async (done) => {
    await connect();
    expect(db.instance instanceof mongoose.Mongoose).toBeTruthy();
    expect(db.instance.connection.readyState).toBeTruthy();
    expect(db.instance.connection.db).toBeDefined();
    expect(db.instance.connection.config).toHaveProperty('autoIndex');
    await disconnect(done);
  });

  test('Failed DB connection should throw an error', async (done) => {
    const oldDbUri = process.env.MONGODB_URI_TEST;
    process.env.MONGODB_URI_TEST = 'mongodb://unknown_user:123456@db:27017/unknown_db';
    try {
      await connect();
    } catch (error) {
      expect(error.name).toBe('MongoError');
      expect(error.message).toBe('Authentication failed.');
    }

    process.env.MONGODB_URI_TEST = oldDbUri;
    await disconnect(done);
  });

  describe('In test mode', () => {
    beforeAll(async () => {
      await connect('test');
    });

    afterAll(async done => disconnect(done));

    test('The name of the database should be `test`', async () => {
      expect(db.instance.connection.name).toBe('test');
    });

    test('Option `autoIndex` should be true', async () => {
      expect(db.instance.connection.config.autoIndex).toBeTruthy();
    });
  });

  describe('In development mode', () => {
    beforeAll(async () => {
      await connect('development');
    });

    afterAll(async done => disconnect(done));

    test('The name of the database should be equal to `MONGO_INITDB_DATABASE` env variable', async () => {
      const name = process.env.MONGO_INITDB_DATABASE;
      expect(db.instance.connection.name).toBe(name);
    });

    test('Option `autoIndex` should be true', async () => {
      expect(db.instance.connection.config.autoIndex).toBeTruthy();
    });
  });

  describe('In production mode', () => {
    beforeAll(async () => {
      await connect('production');
    });

    afterAll(async done => disconnect(done));

    test('The name of the database should be equal to `MONGO_INITDB_DATABASE` env variable', async () => {
      const name = process.env.MONGO_INITDB_DATABASE;
      expect(db.instance.connection.name).toBe(name);
    });

    test('Option `autoIndex` should be false', async () => {
      expect(db.instance.connection.config.autoIndex).toBeFalsy();
    });
  });
});
