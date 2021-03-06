module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/extensions': ['error', 'never', { vue: 'always' }],
    'no-shadow': ['error', { allow: ['state', 'payload', 'getters'] }],
    'no-param-reassign': ['error', { props: false }],
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'no-empty': ['error', { allowEmptyCatch: true }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
