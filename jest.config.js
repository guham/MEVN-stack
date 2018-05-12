module.exports = {
  verbose: true,
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'json'
  ],
  testMatch: [
    '<rootDir>/tests/**/*.js'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js}',
    '!**/node_modules/**',
    '!**/client/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/.eslintrc.js',
    '!**/mongodb-setup.js',
    '!**/server.js'
  ]
}
