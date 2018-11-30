module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    'no-unused-vars': ['error', { 'argsIgnorePattern': 'next' }],
  },
  parserOptions: {
    ecmaVersion: 9,
  },
  overrides: [
    {
      files: [ 'tests/**/*.js' ],
      rules: {
        'global-require': 'off',
        'no-underscore-dangle': 'off',
        'max-len': 'off',
      }
    }
  ],
};
