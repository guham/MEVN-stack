const db = require('../db');
const UserModel = require('../components/users/UserModel');
const FooModel = require('../models/foo');

const models = {
  UserModel,
  FooModel,
};

/**
 * clean DB before running tests
 * then recreate all collections with indexes
 */
module.exports = async function setup() {
  await db.connect();
  const collections = await db.mongoose.connection.db.collections();
  await Promise.all(collections.map(collection => collection.drop()));
  await Promise.all(Object.values(models).map(model => model.ensureIndexes()));
  return db.disconnect();
};
