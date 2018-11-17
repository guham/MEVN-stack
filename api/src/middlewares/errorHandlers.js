const debug = require('../components/debug')('app');
const { parameters } = require('../parameters');

exports.asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.errorHandler = (err, req, res, next) => {
  debug(err.stack);

  res.status(err.status || 500);
  res.json({
    type: err.name,
    message: err.message,
    error: parameters.app.isInEnv('development') ? err : {},
  });
};
