export default {
  defaults: { baseURL: process.env.VUE_APP_API_URL },
  get: jest.fn(() => Promise.resolve({ data: { data: 'This is a value fetched from server' } })),
};
