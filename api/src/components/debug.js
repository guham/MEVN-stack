const debug = require('debug');
const { parameters } = require('../parameters');

if (parameters.app.isInEnv('test')) {
  debug.disable();
}

module.exports = ns => debug(ns);
