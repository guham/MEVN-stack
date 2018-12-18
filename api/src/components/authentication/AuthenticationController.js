const createError = require('http-errors');

const authenticationController = ({ usersService, authenticationService }) => ({
  generateTokens: async (req, res, next) => {
    const { idToken } = req.body;
    const payload = await authenticationService.verifyIdToken(idToken);
    const tokens = await authenticationService.createAndReturnTokens(payload);
    const user = await usersService.findOrCreate(payload.sub);
    await usersService.storeUserRefreshToken(user, tokens.refreshToken);
    res.json(tokens);
  },

  refreshTokens: async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const { refreshToken } = req.body;
      // access token
      const accessToken = await authenticationService.retrieveDecodedAccessToken(authorization);
      // the refresh token should be valid, not expired JWT
      const decodedRefreshToken = await authenticationService
        .validateAndVerifyRefreshToken(refreshToken);
      // the refresh token's user must be equal to the access' token user
      if (decodedRefreshToken.uid !== accessToken.payload.uid) {
        throw new createError.Forbidden();
      }
      // remove the old refresh token
      const user = await usersService.findOne({ sub: accessToken.payload.uid });
      if (!user) {
        throw new createError.Forbidden('User not found');
      }

      if (!await usersService.removeUserRefreshToken(user, refreshToken)) {
        throw new createError.Forbidden('Refresh token not found');
      }
      // generate new access & refresh tokens
      const payload = {
        sub: accessToken.payload.uid,
      };
      const tokens = await authenticationService.createAndReturnTokens(payload);
      // store the new refresh token
      await usersService.storeUserRefreshToken(user, tokens.refreshToken);
      res.json(tokens);
    } catch (err) {
      const error = err instanceof createError.HttpError ? err : new createError.Unauthorized(err.message || 'Unauthorized');
      next(error);
    }
  },

  userSignOut: async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const { refreshToken } = req.body;
      // access token
      const decodedAccessToken = await authenticationService
        .retrieveDecodedAccessToken(authorization);
      // refresh token
      const decodedRefreshToken = await authenticationService
        .retrieveDecodedRefreshToken(refreshToken);
      // the refresh token's user must be equal to the access' token user
      if (decodedRefreshToken.payload.uid !== decodedAccessToken.payload.uid) {
        throw new createError.Forbidden();
      }

      const user = await usersService.findOne({ sub: decodedAccessToken.payload.uid });
      if (!user) {
        throw new createError.Forbidden('User not found');
      }

      if (!await usersService.removeUserRefreshToken(user, refreshToken)) {
        throw new createError.Forbidden('Refresh token not found');
      }

      res.json({});
    } catch (err) {
      const error = err instanceof createError.HttpError ? err : new createError.Unauthorized(err.message || 'Unauthorized');
      next(error);
    }
  },
});

module.exports = authenticationController;
