const debug = require('../components/debug')('app');
const { verifyJwt } = require('../services/auth');

exports.authenticate = (req, res, next) => {
  if (!req.headers || !(req.headers.authorization)) {
    return next(new Error('Authorization header is required.'));
  }

  const token = req.headers.authorization.replace(/^\s*Bearer\s*/, '');

  try {
    verifyJwt(token);
    return next();
  } catch (error) {
    debug(error);
  }

  return res.status(401).send();
};
