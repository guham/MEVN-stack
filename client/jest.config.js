module.exports = {
  verbose: true,
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: [
    '<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))',
  ],
  testURL: 'http://localhost/',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/tests/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,vue}',
    '!<rootDir>/src/main.js',
    '!<rootDir>/src/store/index.js',
  ],
  setupFiles: [
    '<rootDir>/tests/unit/setup/localStorage.js',
    '<rootDir>/tests/unit/setup/gapi.js',
  ],
  timers: 'fake',
  clearMocks: true,
};
