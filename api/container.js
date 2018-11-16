const { createContainer, asClass, asValue } = require('awilix');

const container = createContainer();

const UsersRepository = require('./components/users/UsersRepository');
const UsersService = require('./components/users/UsersService');
const UserModel = require('./components/users/UserModel');

const AuthenticationService = require('./components/authentication/AuthenticationService');

// Services
container.register({
  usersService: asClass(UsersService),
  authenticationService: asClass(AuthenticationService),
});

// Repositories
container.register({
  usersRepository: asClass(UsersRepository).singleton(),
});

// Models
container.register({
  UserModel: asValue(UserModel),
});

module.exports = container;
