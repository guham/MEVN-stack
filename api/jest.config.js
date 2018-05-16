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
  coveragePathIgnorePatterns: [
    '<rootDir>/(node_modules|coverage|tests)/',
    '<rootDir>/(server|jest.config|.eslintrc).js',
  ],
  collectCoverageFrom: [
    '<rootDir>/**/*.js',
  ],
};
