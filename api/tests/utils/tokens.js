const { accessTokenService, refreshTokenService } = require('../../services');

// { uid: '123456', iat: 1530490533, exp: 1530497733, iss: 'accounts.google.com' }
// exp = iat + 2h
// secret = process.env.ACCESS_TOKEN_SECRET_KEY
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxMjM0NTYiLCJpYXQiOjE1MzA0OTA1MzMsImV4cCI6MTUzMDQ5NzczMywiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSJ9.u3yLEHFhWnHZsV-nYx8b6SdW09IuVzMKQIDC2R9Uvf0';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ.eyJ1aWQiOiIxMjM0NTYiLCJpYXQiOjE1MzA0OTA1MzMsImV4cCI6MTUzMDQ5NzczMywiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSJ.u3yLEHFhWnHZsV-nYx8b6SdW09IuVzMKQIDC2R9Uvf0';

const defaultUserPayload = {
  sub: '123456',
};

const getDefaultUserPayload = () => defaultUserPayload;

const getValidAccessToken = () => accessTokenService.sign(defaultUserPayload);
const getExpiredAccessToken = () => token;
const getInvalidAccessToken = () => invalidToken;

const getValidRefreshToken = () => refreshTokenService.sign(defaultUserPayload);
const getExpiredRefreshToken = () => token;
const getInvalidRefreshToken = () => invalidToken;

module.exports = {
  getDefaultUserPayload,
  getValidAccessToken,
  getExpiredAccessToken,
  getInvalidAccessToken,
  getValidRefreshToken,
  getExpiredRefreshToken,
  getInvalidRefreshToken,
};
