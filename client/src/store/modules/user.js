import sendIdToken from '@/api/authentication/auth';
import * as types from '@/store/mutation-types';

const state = {
  isAuthenticated: false,
  jwt: localStorage.getItem('token'),
  jwtExpiration: localStorage.getItem('tokenExpiration'),
};

const getters = {
  isAuthenticated: state => state.isAuthenticated,
};

const mutations = {
  [types.SET_USER_AUTHENTICATED](state) {
    state.isAuthenticated = true;
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
    const auth2 = window.gapi.auth2.getAuthInstance();
    try {
      const googleUser = await auth2.signIn();
      const idToken = googleUser.getAuthResponse().id_token;
      const response = await sendIdToken(idToken);
      commit(types.SET_USER_AUTHENTICATED);
      commit(types.SET_JWT, response.token);
      commit(types.SET_JWT_EXPIRATION, response.tokenExpiration);
    } catch (error) {
      commit(types.SET_USER_UNAUTHENTICATED);
    }
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
