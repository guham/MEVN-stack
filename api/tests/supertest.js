const request = require('supertest');
const { accessToken } = require('../services');

const { Test } = request;

Test.prototype.authenticate = function authenticate() {
  const userPayload = {
    sub: 123456,
  };
  const token = accessToken(userPayload);

  return this.set('Authorization', `Bearer ${token}`);
};

module.exports = request;
