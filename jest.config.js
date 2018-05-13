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
  collectCoverageFrom: [
    '<rootDir>/(controllers|middlewares|models|routes)/**/*.js',
    '<rootDir>/app.js',
  ],
};
