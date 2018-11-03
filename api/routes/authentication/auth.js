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
router.post('/refreshToken', errorHandlers.asyncMiddleware(authController.refreshTokens));

module.exports = router;
