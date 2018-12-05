const debug = require('debug');

module.exports = ({ parameters }) => (ns) => {
  if (parameters.app.isInEnv('test') || parameters.app.noDebug) {
    debug.disable();
  } else {
    debug.enable(ns);
  }
  return debug(ns);
};
