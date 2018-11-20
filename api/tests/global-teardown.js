const containter = require('../src/container');

const db = containter.resolve('db');

module.exports = async function teardown() {
  await db.disconnect();
};
