/* eslint-disable global-require */
module.exports = (config) => {
  config.set({
    // logLevel: 'trace',
    testRunner: 'jest',
    mutator: 'javascript',
    coverageAnalysis: 'off',
    mutate: [
      'src/**/*.js',
      '!src/server.js',
    ],
    jest: {
      config: require('./jest.config'),
    },
    files: [
      'src/**/*.js',
      'tests/**/*.js',
      '!tests/coverage/**/*.js',
      '!tests/mutation/**/*.js',
    ],
    packageManager: 'yarn',
    reporters: ['html', 'clear-text', 'progress'],
    htmlReporter: {
      baseDir: 'tests/mutation/html',
    },
  });
};
