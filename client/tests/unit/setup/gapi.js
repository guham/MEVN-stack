const googleUser = {
  getAuthResponse: jest.fn(() => ({
    id_token: 'google_id_token',
  })),
};

const gapiMock = {
  auth2: {
    init: jest.fn(function init() {
      return this;
    }),
    getAuthInstance: jest.fn(function getAuthInstance() {
      return this;
    }),
    isSignedIn: {
      get: jest.fn(() => false),
    },
    signIn: jest.fn(() => googleUser),
    signOut: jest.fn(),
  },
  load: jest.fn((library, cb) => cb()),
};

Object.defineProperty(window, 'gapi', {
  value: gapiMock,
});
