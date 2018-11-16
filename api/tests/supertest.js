const request = require('supertest');
const { getValidAccessToken } = require('./utils/tokens');

const { Test } = request;

Test.prototype.authenticate = async function authenticate() {
  const token = await getValidAccessToken();

  return this.set('Authorization', `Bearer ${token}`);
};

module.exports = request;
