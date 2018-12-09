const containter = require('../src/container');
const models = require('./models');

const db = containter.resolve('db');

beforeAll(async () => {
  await db.connect();
});

beforeEach(async () => {
  await Promise.all(Object.values(models).map(model => model.deleteMany({}).exec()));
});

afterAll(async () => {
  await db.disconnect();
});
