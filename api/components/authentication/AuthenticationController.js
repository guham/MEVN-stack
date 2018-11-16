const createError = require('http-errors');

const authenticationController = ({ usersService, authenticationService }) => ({
  generateTokens: async (req, res, next) => {
    const { idToken } = req.body;
    const payload = await authenticationService.verifyIdToken(idToken);
    const tokens = await authenticationService.createAndReturnTokens(payload);
    await usersService.storeUserRefreshToken(payload.sub, tokens.refreshToken);
    res.json(tokens);
  },

  refreshTokens: async (req, res, next) => {
    try {
      // access token
      const { authorization } = req.headers;
      const accessToken = await authenticationService.retrieveDecodedAccessToken(authorization);
      // refresh token should be valid, not expired JWT
      const { refreshToken } = req.body;
      await authenticationService.validateAndVerifyRefreshToken(refreshToken);

      // @todo: refresh token user must be equal to access token user
      // @todo: remove old refresh token
      // @todo: persist new refresh token

      // generate new access & refresh tokens
      const payload = {
        sub: accessToken.payload.uid,
      };
      const tokens = await authenticationService.createAndReturnTokens(payload);
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  },

  userSignOut: async (req, res, next) => {
    try {
      // access token
      const { authorization } = req.headers;
      const decodedAccessToken = await authenticationService
        .retrieveDecodedAccessToken(authorization);
      // refresh token
      const { refreshToken } = req.body;
      const decodedRefreshToken = await authenticationService
        .retrieveDecodedRefreshToken(refreshToken);
      // @todo: refresh token user must be equal to access token user
      if (decodedRefreshToken.payload.uid !== decodedAccessToken.payload.uid) {
        throw new createError.Unauthorized();
      }

      const user = await usersService.findOne({ sub: decodedAccessToken.payload.uid });
      if (!user) {
        throw new createError.Unauthorized();
      }

      if (!await usersService.removeUserRefreshToken(user, refreshToken)) {
        throw new createError.Unauthorized();
      }

      res.json({});
    } catch (error) {
      next(error);
    }
  },
});

module.exports = authenticationController;
