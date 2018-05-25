module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/extensions': ['error', 'ignorePackages']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
