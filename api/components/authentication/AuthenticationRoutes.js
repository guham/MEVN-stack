const { Router } = require('express');
const { makeInvoker } = require('awilix-express');
const { errorHandlers } = require('../../middlewares');
const authenticationController = require('./AuthenticationController');

const router = Router();
const api = makeInvoker(authenticationController);

/**
 * Validate the authenticity of the Google ID token
 * then provide the client the own signed access and refresh tokens
 */
router.post('/tokens', errorHandlers.asyncMiddleware(api('generateTokens')));

/**
 * Provide the client new access and refresh tokens
 */
router.post('/refreshTokens', errorHandlers.asyncMiddleware(api('refreshTokens')));

/**
 * Remove user current refresh token when sign-out
 */
router.post('/signOut', errorHandlers.asyncMiddleware(api('userSignOut')));

module.exports = router;
