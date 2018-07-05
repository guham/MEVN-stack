import axios from 'axios';
import userStore from '@/store/modules/user';
import testAction from '../../test-action';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

const data = {
  token: 'token',
  tokenExpiration: '1530325940',
};

const error = {
  status: 500,
  statusText: 'Internal Server Error',
  data: {
    message: 'Error message',
  },
};

describe('User store', () => {
  describe('getters', () => {
    test('`isAuthenticated` returns state.isAuthenticated value', () => {
      const state = {
        isAuthenticated: false,
      };
      expect(userStore.getters.isAuthenticated(state)).toBe(false);
    });
  });

  describe('mutations', () => {
    test('SET_USER_AUTHENTICATED', () => {
      const state = {
        isAuthenticated: false,
      };
      userStore.mutations.SET_USER_AUTHENTICATED(state);
      expect(state.isAuthenticated).toBe(true);
    });

    test('SET_USER_UNAUTHENTICATED', () => {
      const state = {
        isAuthenticated: true,
        jwt: 'token',
        jwtExpiration: '1530325940',
      };
      userStore.mutations.SET_USER_UNAUTHENTICATED(state);
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.jwt).toEqual(null);
      expect(state.jwtExpiration).toEqual(null);
    });

    test('SET_JWT', () => {
      const state = {
        jwt: 'token',
      };
      const newToken = 'new_token';
      userStore.mutations.SET_JWT(state, newToken);
      expect(state.jwt).toBe(newToken);
    });

    test('SET_JWT_EXPIRATION', () => {
      const state = {
        jwtExpiration: 'exp_date',
      };
      const newJwtExpiration = 'new_exp_date';
      userStore.mutations.SET_JWT_EXPIRATION(state, newJwtExpiration);
      expect(state.jwtExpiration).toBe(newJwtExpiration);
    });
  });

  describe('actions', () => {
    test('signIn - Google Sign-In then fetch token & expiration date from the API', (done) => {
      axios.post.mockImplementation(() => Promise.resolve({
        data,
      }));

      testAction(userStore.actions.signIn, null, {}, {}, [
        { type: 'SET_USER_AUTHENTICATED' },
        { type: 'SET_JWT', payload: data.token },
        { type: 'SET_JWT_EXPIRATION', payload: data.tokenExpiration },
      ], done);

      expect(window.gapi.auth2.getAuthInstance).toHaveBeenCalledTimes(1);
    });

    test('signIn - calls SET_USER_UNAUTHENTICATED mutation if error', (done) => {
      axios.post.mockImplementation(() => Promise.reject(error));

      testAction(userStore.actions.signIn, null, {}, {}, [
        { type: 'SET_USER_UNAUTHENTICATED' },
      ], done);
    });

    test('signOut', (done) => {
      testAction(userStore.actions.signOut, null, {}, {}, [
        { type: 'SET_USER_UNAUTHENTICATED' },
      ], done);

      expect(window.gapi.auth2.getAuthInstance).toHaveBeenCalledTimes(1);
    });
  });
});