const faker = require('faker');

module.exports = (factory, { UserModel }) => {
  factory.define('user', UserModel, {
    sub: faker.random.number(),
  });
};
