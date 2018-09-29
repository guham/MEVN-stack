import authClient from '@/api/auth';
import * as types from '@/store/mutation-types';

const state = {
  isAuthenticated: false,
  userIsSigningIn: false,
  jwt: localStorage.getItem('token'),
  jwtExpiration: parseInt(localStorage.getItem('tokenExpiration'), 10) || null,
};

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  userIsSigningIn: state => state.userIsSigningIn,
  token: state => state.jwt,
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
    state.jwt = null;
    state.jwtExpiration = null;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
  },

  [types.SET_JWT](state, token) {
    state.jwt = token;
    localStorage.setItem('token', token);
  },

  [types.SET_JWT_EXPIRATION](state, tokenExpiration) {
    state.jwtExpiration = tokenExpiration;
    localStorage.setItem('tokenExpiration', tokenExpiration);
  },
};

const actions = {
  async signIn({ commit }) {
    commit(types.SET_USER_IS_SIGNING_IN, true);
    const auth2 = window.gapi.auth2.getAuthInstance();
    try {
      const googleUser = await auth2.signIn();
      const idToken = googleUser.getAuthResponse().id_token;
      const response = await authClient.sendIdToken(idToken);
      commit(types.SET_USER_AUTHENTICATED);
      commit(types.SET_JWT, response.token);
      commit(types.SET_JWT_EXPIRATION, response.tokenExpiration);
    } catch (error) {
      commit(types.SET_USER_UNAUTHENTICATED);
    }
    commit(types.SET_USER_IS_SIGNING_IN, false);
  },
  async signOut({ commit }) {
    const auth2 = window.gapi.auth2.getAuthInstance();
    await auth2.signOut();
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
