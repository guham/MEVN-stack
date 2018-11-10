const createError = require('http-errors');
const { User } = require('../models');
const {
  auth,
  userService,
  accessTokenService,
  refreshTokenService,
} = require('../services');

exports.createAndReturnTokens = (payload) => {
  const accessToken = accessTokenService.sign(payload);
  const refreshToken = refreshTokenService.sign(payload);
  const expirationDate = accessTokenService.verify(accessToken).exp;

  return {
    accessToken,
    refreshToken,
    expirationDate,
  };
};

exports.generateTokens = async (req, res, next) => {
  const { idToken } = req.body;
  const payload = await auth.verifyIdToken(idToken);
  const tokens = exports.createAndReturnTokens(payload);
  await userService.storeUserRefreshToken(payload.sub, tokens.refreshToken);
  res.json(tokens);
};

exports.refreshTokens = (req, res, next) => {
  try {
    // access token
    const { authorization } = req.headers;
    const decodedAccessToken = accessTokenService.validateAndReturnDecodedToken(authorization);
    // refresh token should be valid, not expired JWT
    const { refreshToken } = req.body;
    refreshTokenService.validateAndVerifyRefreshToken(refreshToken);

    // @todo: refresh token user must be equal to access token user
    // @todo: remove old refresh token
    // @todo: persist new refresh token

    // generate new access & refresh tokens
    const payload = {
      sub: decodedAccessToken.payload.uid,
    };
    const tokens = exports.createAndReturnTokens(payload);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

exports.userSignOut = async (req, res, next) => {
  try {
    // access token
    const { authorization } = req.headers;
    const decodedAccessToken = accessTokenService.validateAndReturnDecodedToken(authorization);
    // refresh token
    const { refreshToken } = req.body;
    const decodedRefreshToken = refreshTokenService.validateAndReturnDecodedToken(refreshToken);
    // @todo: refresh token user must be equal to access token user
    if (decodedRefreshToken.payload.uid !== decodedAccessToken.payload.uid) {
      throw new createError.Unauthorized();
    }

    const user = await User.findOne({ sub: decodedAccessToken.payload.uid }).exec();
    if (!user) {
      throw new createError.Unauthorized();
    }

    if (!await userService.removeUserRefreshToken(user, refreshToken)) {
      throw new createError.Unauthorized();
    }

    res.json({});
  } catch (error) {
    next(error);
  }
};
