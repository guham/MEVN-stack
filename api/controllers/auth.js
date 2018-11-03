const {
  auth,
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
  // @todo: store user refresh token
  res.json(tokens);
};

exports.refreshTokens = (req, res, next) => {
  try {
    // access token
    const { authorization } = req.headers;
    const decodedAccessToken = accessTokenService.validateAndReturnDecodedToken(authorization);
    // refresh token should be valid, not expired JWT
    const { refreshToken } = req.body;
    refreshTokenService.validateAndReturnDecodedToken(refreshToken);

    // @todo: refresh token user must be equal to access token user

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
