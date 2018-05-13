const debug = require('debug')('app');

exports.asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.errorHandler = (err, req, res, next) => {
  debug(err.stack);

  res.status(err.status || 500);
  res.json({
    type: err.name,
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};
