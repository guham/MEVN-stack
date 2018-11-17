module.exports = {
  verbose: true,
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'json',
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/tests/coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/(node_modules|tests)/',
    '<rootDir>/(jest.config|.eslintrc).js',
    '<rootDir>/src/server.js',
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
  ],
  globalSetup: '<rootDir>/tests/global-setup.js',
};
