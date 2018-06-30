const express = require('express');
const { errorHandlers } = require('../../middlewares');
const { verifyIdToken, generateJwt, verifyJwt } = require('../../services/auth');

const router = express.Router();

/**
 * Validate the authenticity of the Google ID token
 * then provide the client the own signed JWT
 */
router.post('/token', errorHandlers.asyncMiddleware(async (req, res, next) => {
  const { idToken } = req.body;
  const payload = await verifyIdToken(idToken);
  const token = generateJwt(payload);
  const tokenExpiration = verifyJwt(token).exp;
  res.json({
    token,
    tokenExpiration,
  });
}));

module.exports = router;
