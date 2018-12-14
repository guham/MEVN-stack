const config = require('./jest.config');

config.testMatch = [
  '<rootDir>/tests/unit/**/*.test.js',
];
config.collectCoverage = true;
config.coverageDirectory = '<rootDir>/tests/coverage';
config.coveragePathIgnorePatterns = [
  '<rootDir>/src/server.js',
];
config.collectCoverageFrom = [
  '<rootDir>/src/**/*.js',
];

module.exports = config;
