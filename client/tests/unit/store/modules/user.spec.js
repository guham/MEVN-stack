import axios from 'axios';
import userStore from '@/store/modules/user';
import Notification from '@/models/notification';
import testAction from '../../test-action';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

const data = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  expirationDate: '1530325940',
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

    test('`accessToken` returns state.accessToken value', () => {
      const state = {
        accessToken: 'token',
      };
      expect(userStore.getters.accessToken(state)).toBe('token');
    });

    test('`refreshToken` returns state.refreshToken value', () => {
      const state = {
        refreshToken: 'refreshToken',
      };
      expect(userStore.getters.refreshToken(state)).toBe('refreshToken');
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
        accessToken: 'token',
        refreshToken: 'refreshToken',
        expirationDate: '1530325940',
      };
      userStore.mutations.SET_USER_UNAUTHENTICATED(state);
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.accessToken).toEqual(null);
      expect(state.refreshToken).toEqual(null);
      expect(state.expirationDate).toEqual(null);
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

    test('SET_ACCESS_TOKEN', () => {
      const state = {
        accessToken: 'token',
      };
      const newToken = 'new_token';
      userStore.mutations.SET_ACCESS_TOKEN(state, newToken);
      expect(state.accessToken).toBe(newToken);
    });

    test('SET_REFRESH_TOKEN', () => {
      const state = {
        refreshToken: 'token',
      };
      const newToken = 'new_token';
      userStore.mutations.SET_REFRESH_TOKEN(state, newToken);
      expect(state.refreshToken).toBe(newToken);
    });

    test('SET_EXPIRATION_DATE', () => {
      const state = {
        expirationDate: 'exp_date',
      };
      const newExpirationDate = 'new_exp_date';
      userStore.mutations.SET_EXPIRATION_DATE(state, newExpirationDate);
      expect(state.expirationDate).toBe(newExpirationDate);
    });
  });

  describe('actions', () => {
    test('signIn - Google Sign-In then fetch tokens & expiration date from the API', (done) => {
      axios.post.mockImplementation(() => Promise.resolve({
        data,
      }));

      testAction(userStore.actions.signIn, null, {}, {}, [
        { type: 'SET_USER_IS_SIGNING_IN', payload: true },
        { type: 'SET_USER_AUTHENTICATED' },
        { type: 'SET_ACCESS_TOKEN', payload: data.accessToken },
        { type: 'SET_REFRESH_TOKEN', payload: data.refreshToken },
        { type: 'SET_EXPIRATION_DATE', payload: data.expirationDate },
        { type: 'SET_USER_IS_SIGNING_IN', payload: false },
      ], [], done);

      expect(window.gapi.auth2.getAuthInstance).toHaveBeenCalledTimes(1);
    });

    test('signIn - push notification & deauthenticate the user if problems occur during Sign-In workflow or when fetching tokens from the API', (done) => {
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
