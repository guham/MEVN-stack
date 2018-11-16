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
    '<rootDir>/(server|jest.config|.eslintrc).js',
  ],
  collectCoverageFrom: [
    '<rootDir>/**/*.js',
  ],
  globalSetup: '<rootDir>/tests/global-setup.js',
};
