module.exports = {
  verbose: true,
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'json',
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.js', // @todo: should be <rootDir>/tests/unit/**/*.test.js
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/tests/coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/server.js',
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
  ],
  globalSetup: '<rootDir>/tests/global-setup.js',
  globalTeardown: '<rootDir>/tests/global-teardown.js',
  setupTestFrameworkScriptFile: '<rootDir>/tests/setup.js',
};
