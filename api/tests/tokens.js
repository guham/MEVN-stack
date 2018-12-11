const container = require('../src/container');

const authenticationService = container.resolve('authenticationService');
// { uid: '123456', iat: 1530490533, exp: 1530497733, iss: 'accounts.google.com' }
// exp = iat + 2h
// secret = process.env.ACCESS_TOKEN_SECRET_KEY
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxMjM0NTYiLCJpYXQiOjE1MzA0OTA1MzMsImV4cCI6MTUzMDQ5NzczMywiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSJ9.u3yLEHFhWnHZsV-nYx8b6SdW09IuVzMKQIDC2R9Uvf0';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ.eyJ1aWQiOiIxMjM0NTYiLCJpYXQiOjE1MzA0OTA1MzMsImV4cCI6MTUzMDQ5NzczMywiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSJ.u3yLEHFhWnHZsV-nYx8b6SdW09IuVzMKQIDC2R9Uvf0';

const defaultUserPayload = {
  sub: '123456',
};

const getDefaultUserPayload = () => defaultUserPayload;

const getValidAccessToken = async customUserPayload => authenticationService.signAccessToken({ ...defaultUserPayload, ...customUserPayload });
const getExpiredAccessToken = () => token;
const getInvalidAccessToken = () => invalidToken;
const getDecodedAccessToken = async () => authenticationService.retrieveDecodedAccessToken(`Bearer ${await getValidAccessToken()}`);

const getValidRefreshToken = async customUserPayload => authenticationService.signRefreshToken({ ...defaultUserPayload, ...customUserPayload });
const getExpiredRefreshToken = () => token;
const getInvalidRefreshToken = () => invalidToken;
const getDecodedRefreshToken = async () => authenticationService.retrieveDecodedRefreshToken(await getValidRefreshToken());

module.exports = {
  getDefaultUserPayload,
  // access token
  getValidAccessToken,
  getExpiredAccessToken,
  getInvalidAccessToken,
  getDecodedAccessToken,
  // refresh token
  getValidRefreshToken,
  getExpiredRefreshToken,
  getInvalidRefreshToken,
  getDecodedRefreshToken,
};
