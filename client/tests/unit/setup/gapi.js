const googleUser = {
  getAuthResponse: jest.fn(() => ({
    id_token: 'google_id_token',
  })),
};

const gapiMock = {
  auth2: {
    getAuthInstance: jest.fn(() => ({
      signIn: jest.fn(() => googleUser),
      signOut: jest.fn(),
    })),
  },
};

Object.defineProperty(window, 'gapi', {
  value: gapiMock,
});
