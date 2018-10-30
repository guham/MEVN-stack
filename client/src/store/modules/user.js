import authClient from '@/api/auth';
import * as types from '@/store/mutation-types';
import Notification from '@/models/notification';

const state = {
  isAuthenticated: false,
  userIsSigningIn: false,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  expirationDate: parseInt(localStorage.getItem('expirationDate'), 10) || null,
};

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  userIsSigningIn: state => state.userIsSigningIn,
  accessToken: state => state.accessToken,
  refreshToken: state => state.refreshToken,
};

const mutations = {
  [types.SET_USER_AUTHENTICATED](state) {
    state.isAuthenticated = true;
  },

  [types.SET_USER_IS_SIGNING_IN](state, flag = true) {
    state.userIsSigningIn = flag;
  },

  [types.SET_USER_UNAUTHENTICATED](state) {
    state.isAuthenticated = false;
    state.accessToken = null;
    state.refreshToken = null;
    state.expirationDate = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expirationDate');
  },

  [types.SET_ACCESS_TOKEN](state, token) {
    state.accessToken = token;
    localStorage.setItem('accessToken', token);
  },

  [types.SET_REFRESH_TOKEN](state, token) {
    state.refreshToken = token;
    localStorage.setItem('refreshToken', token);
  },

  [types.SET_EXPIRATION_DATE](state, expirationDate) {
    state.expirationDate = expirationDate;
    localStorage.setItem('expirationDate', expirationDate);
  },
};

const actions = {
  async signIn({ dispatch, commit }) {
    commit(types.SET_USER_IS_SIGNING_IN, true);

    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      const idToken = googleUser.getAuthResponse().id_token;
      const response = await authClient.sendIdToken(idToken);
      commit(types.SET_USER_AUTHENTICATED);
      commit(types.SET_ACCESS_TOKEN, response.accessToken);
      commit(types.SET_REFRESH_TOKEN, response.refreshToken);
      commit(types.SET_EXPIRATION_DATE, response.expirationDate);
    } catch (e) {
      // display a notification only when error happened with the API
      // auth2.signIn() will returns an object containing an *error* property if an error happened
      if (!e.error) {
        dispatch('addThenRemoveNotification', new Notification('error', '%SOMETHING_WENT_WRONG%'), { root: true });
      }
      await dispatch('signOut');
    }
    commit(types.SET_USER_IS_SIGNING_IN, false);
  },
  async signOut({ dispatch, commit }) {
    const auth2 = window.gapi.auth2.getAuthInstance();
    await auth2.signOut().catch(() => {
      dispatch('addThenRemoveNotification', new Notification('error', '%SOMETHING_WENT_WRONG%'), { root: true });
    });
    commit(types.SET_USER_UNAUTHENTICATED);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
