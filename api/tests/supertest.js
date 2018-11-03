const request = require('supertest');
const { getValidAccessToken } = require('./utils/tokens');

const { Test } = request;

Test.prototype.authenticate = function authenticate() {
  const token = getValidAccessToken();

  return this.set('Authorization', `Bearer ${token}`);
};

module.exports = request;
