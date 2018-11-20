const containter = require('../src/container');

const db = containter.resolve('db');
const UserModel = containter.resolve('UserModel');
const FooModel = containter.resolve('FooModel');

const models = {
  UserModel,
  FooModel,
};

/**
 * Clean the DB before running tests
 * then recreate all collections with indexes
 */
module.exports = async function setup() {
  await db.connect();
  const collections = await db.connection.db.collections();
  await Promise.all(collections.map(collection => collection.drop()));
  await Promise.all(Object.values(models).map(model => model.ensureIndexes()));
  await db.disconnect();
};
