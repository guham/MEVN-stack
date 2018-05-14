module.exports = {
  root: true,
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 8
  },
  env: {
    es6: true,
    node: true,
    jest: true
  },
  rules: {
    'no-unused-vars': ['error', { 'argsIgnorePattern': 'next' }]
  },
  overrides: [
    {
      files: [ '*.test.js' ],
      rules: {
        'global-require': 'off',
        'no-underscore-dangle': 'off'
      }
    }
  ]
};
