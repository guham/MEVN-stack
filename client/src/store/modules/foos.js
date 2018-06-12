import * as api from '@/api/foos';
import * as types from '../mutation-types';

const state = {
  foos: [],
  name: '',
  error: {},
};

const getters = {
  count: state => state.foos.length,
  error: state => state.error,
  isValidName: state => state.name.length > 0,
  hasError: state => Object.keys(state.error).length > 0,
};

const mutations = {
  [types.FETCH_FOOS](state, foos) {
    state.foos = foos;
  },

  [types.ADD_FOO](state, foo) {
    state.foos.push(foo);
  },

  [types.UPDATE_FOO_NAME](state, name) {
    state.name = name.trim();
  },

  [types.SET_ERROR](state, error) {
    state.error = error;
  },

  [types.RESET_ERROR](state) {
    state.error = {};
  },
};

const actions = {
  async fetchFoos({ commit }) {
    const foos = await api.fetchFoos();
    commit(types.FETCH_FOOS, foos);
  },

  async addFoo({ commit, state, getters }) {
    if (!getters.isValidName) {
      return;
    }
    try {
      const foo = await api.addFoo(state.name);
      commit(types.ADD_FOO, foo);
      commit(types.UPDATE_FOO_NAME, '');
      commit(types.RESET_ERROR);
    } catch (error) {
      commit(types.SET_ERROR, error.response.data);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
