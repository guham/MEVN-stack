const express = require('express');
const { authController } = require('../../controllers');
const { errorHandlers } = require('../../middlewares');

const router = express.Router();

/**
 * Validate the authenticity of the Google ID token
 * then provide the client the own signed access and refresh tokens
 */
router.post('/tokens', errorHandlers.asyncMiddleware(authController.generateTokens));

/**
 * Provide the client new access and refresh tokens
 */
router.post('/refreshTokens', errorHandlers.asyncMiddleware(authController.refreshTokens));

/**
 * Remove user current refresh token when sign-out
 */
router.post('/signOut', errorHandlers.asyncMiddleware(authController.userSignOut));

module.exports = router;
