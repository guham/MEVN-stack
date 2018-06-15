export default {
  defaults: { baseURL: process.env.VUE_APP_API_URL },
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    response: {
      use: jest.fn(),
    },
  },
  create: jest.fn(function create() {
    return this;
  }),
};
