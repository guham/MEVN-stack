const debug = require('debug');
const { app } = require('../parameters').parameters;

if (app.isInEnv('test')) {
  debug.disable();
}

module.exports = ns => debug(ns);
