const faker = require('faker');

module.exports = (factory, { FooModel }) => {
  factory.define('foo', FooModel, {
    name: faker.lorem.sentence(),
  });
};
