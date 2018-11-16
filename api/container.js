const { createContainer, asClass, asValue } = require('awilix');

const container = createContainer();

const AuthenticationService = require('./components/authentication/AuthenticationService');

const UserModel = require('./components/users/UserModel');
const UsersRepository = require('./components/users/UsersRepository');
const UsersService = require('./components/users/UsersService');

const FooModel = require('./components/foos/FooModel');
const FoosRepository = require('./components/foos/FoosRepository');
const FoosService = require('./components/foos/FoosService');

// Models
container.register({
  UserModel: asValue(UserModel),
  FooModel: asValue(FooModel),
});

// Repositories
container.register({
  usersRepository: asClass(UsersRepository).singleton(),
  foosRepository: asClass(FoosRepository).singleton(),
});

// Services
container.register({
  authenticationService: asClass(AuthenticationService),
  usersService: asClass(UsersService),
  foosService: asClass(FoosService),
});

module.exports = container;
