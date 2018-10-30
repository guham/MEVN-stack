const express = require('express');
const { errorHandlers } = require('../../middlewares');
const {
  auth,
  accessToken: generateAccessToken,
  refreshToken: generateRefreshToken,
} = require('../../services');

const router = express.Router();

/**
 * Validate the authenticity of the Google ID token
 * then provide the client the own signed access and refresh tokens
 */
router.post('/token', errorHandlers.asyncMiddleware(async (req, res, next) => {
  const { idToken } = req.body;
  const payload = await auth.verifyIdToken(idToken);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const expirationDate = auth.verifyJwt(accessToken).exp;

  res.json({
    accessToken,
    refreshToken,
    expirationDate,
  });
}));

module.exports = router;
