const request = require('supertest');
const app = require('../src/app');
const { getValidAccessToken } = require('./tokens');

const { Test } = request;

Test.prototype.authenticate = async function authenticate() {
  const token = await getValidAccessToken();

  return this.set('Authorization', `Bearer ${token}`);
};

module.exports = () => request(app);
