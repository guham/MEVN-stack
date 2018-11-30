const containter = require('../src/container');

const UserModel = containter.resolve('UserModel');
const FooModel = containter.resolve('FooModel');

module.exports = {
  UserModel,
  FooModel,
};
