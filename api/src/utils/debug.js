const debug = require('debug');

module.exports = ({ parameters }) => (ns) => {
  if (parameters.app.isInEnv('test')) {
    debug.disable();
  } else {
    debug.enable(ns);
  }
  return debug(ns);
};
