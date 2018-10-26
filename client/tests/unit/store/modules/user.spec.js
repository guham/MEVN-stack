import axios from 'axios';
import userStore from '@/store/modules/user';
import Notification from '@/models/notification';
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

    test('`userIsSigningIn` returns state.userIsSigningIn value', () => {
      const state = {
        userIsSigningIn: true,
      };
      expect(userStore.getters.userIsSigningIn(state)).toBe(true);
    });

    test('`token` returns state.jwt value', () => {
      const state = {
        jwt: 'token',
      };
      expect(userStore.getters.token(state)).toBe('token');
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

    test('SET_USER_IS_SIGNING_IN without flag', () => {
      const state = {
        userIsSigningIn: false,
      };
      userStore.mutations.SET_USER_IS_SIGNING_IN(state);
      expect(state.userIsSigningIn).toBe(true);
    });

    test('SET_USER_IS_SIGNING_IN with boolean flag', () => {
      const state = {
        userIsSigningIn: true,
      };
      userStore.mutations.SET_USER_IS_SIGNING_IN(state, false);
      expect(state.userIsSigningIn).toBe(false);
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
        { type: 'SET_USER_IS_SIGNING_IN', payload: true },
        { type: 'SET_USER_AUTHENTICATED' },
        { type: 'SET_JWT', payload: data.token },
        { type: 'SET_JWT_EXPIRATION', payload: data.tokenExpiration },
        { type: 'SET_USER_IS_SIGNING_IN', payload: false },
      ], [], done);

      expect(window.gapi.auth2.getAuthInstance).toHaveBeenCalledTimes(1);
    });

    test('signIn - push notification & deauthenticate the user if problems occur during Sign-In workflow or when fetching JWT from the API', (done) => {
      axios.post.mockImplementation(() => Promise.reject(error));

      testAction(userStore.actions.signIn, null, {}, {}, [
        { type: 'SET_USER_IS_SIGNING_IN', payload: true },
        { type: 'SET_USER_IS_SIGNING_IN', payload: false },
      ], [
        { type: 'addThenRemoveNotification', payload: new Notification('error', '%SOMETHING_WENT_WRONG%') },
        { type: 'signOut' },
      ], done);
    });

    test('signIn - deauthenticate the user if the Google Sign-In connection workflow is cancelled', (done) => {
      const userError = {
        error: 'For exemple when the user closed the popup before finishing the consent flow',
      };
      axios.post.mockImplementation(() => Promise.reject(userError));

      testAction(userStore.actions.signIn, null, {}, {}, [
        { type: 'SET_USER_IS_SIGNING_IN', payload: true },
        { type: 'SET_USER_IS_SIGNING_IN', payload: false },
      ], [
        { type: 'signOut' },
      ], done);
    });

    test('signOut - deauthenticate the user', (done) => {
      window.gapi.auth2.signOut.mockImplementation(() => Promise.resolve());
      testAction(userStore.actions.signOut, null, {}, {}, [
        { type: 'SET_USER_UNAUTHENTICATED' },
      ], [], done);

      expect(window.gapi.auth2.getAuthInstance).toHaveBeenCalledTimes(1);
    });

    test('signOut - deauthenticate the user and push notification if an error happened', (done) => {
      window.gapi.auth2.signOut.mockImplementation(() => Promise.reject(new Error('Google Sign-in error')));
      testAction(userStore.actions.signOut, null, {}, {}, [
        { type: 'SET_USER_UNAUTHENTICATED' },
      ], [
        { type: 'addThenRemoveNotification', payload: new Notification('error', '%SOMETHING_WENT_WRONG%') },
      ], done);

      expect(window.gapi.auth2.getAuthInstance).toHaveBeenCalledTimes(1);
    });
  });
});
