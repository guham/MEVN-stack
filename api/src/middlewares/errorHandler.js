const container = require('../container');

const debug = container.resolve('debug')('app');
const { app } = container.resolve('parameters');

module.exports = (err, req, res, next) => {
  debug(err.stack);

  res.status(err.status || 500);
  res.json({
    type: err.name,
    message: err.message,
    error: app.isInEnv('development') ? err : {},
  });
};
