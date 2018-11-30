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
        throw new createError.Unauthorized();
      }
      // remove the old refresh token
      const user = await usersService.findOne({ sub: accessToken.payload.uid });
      if (!user) {
        throw new createError.Unauthorized();
      }

      if (!await usersService.removeUserRefreshToken(user, refreshToken)) {
        throw new createError.Unauthorized();
      }
      // generate new access & refresh tokens
      const payload = {
        sub: accessToken.payload.uid,
      };
      const tokens = await authenticationService.createAndReturnTokens(payload);
      // store the new refresh token
      await usersService.storeUserRefreshToken(user, tokens.refreshToken);
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
      // the refresh token's user must be equal to the access' token user
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
