const request = require('supertest');
const { generateJwt } = require('../services/auth');

const { Test } = request;

Test.prototype.authenticate = function authenticate() {
  const userPayload = {
    sub: 123456,
  };
  const token = generateJwt(userPayload);

  return this.set('Authorization', `Bearer ${token}`);
};

module.exports = request;
