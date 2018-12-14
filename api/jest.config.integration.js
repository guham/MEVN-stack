const config = require('./jest.config');

config.testMatch = [
  '<rootDir>/tests/features/**/*.test.js',
];

module.exports = config;
