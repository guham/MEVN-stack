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
    getAuthInstance: jest.fn(() => ({
      signIn: jest.fn(() => googleUser),
      signOut: jest.fn(),
    })),
    isSignedIn: {
      get: jest.fn(() => false),
    },
  },
  load: jest.fn((library, cb) => cb()),
};

Object.defineProperty(window, 'gapi', {
  value: gapiMock,
});
