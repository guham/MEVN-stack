import _get from 'lodash/get';
import foosClient from '@/api/foos';
import * as types from '../mutation-types';

const state = {
  foos: [],
  name: '',
  error: {},
};

const getters = {
  count: state => state.foos.length,
  isValidName: state => state.name.length > 0,
  hasError: state => Object.keys(state.error).length > 0,
  errorMessage: (state, getters) => (getters.hasError ? _get(state.error, 'data.message', _get(state.error, 'message', '')) : ''),
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
    try {
      const foos = await foosClient.fetchFoos();
      commit(types.FETCH_FOOS, foos);
    } catch (error) {
      commit(types.SET_ERROR, error);
    }
  },

  async addFoo({ commit, state, getters }) {
    if (!getters.isValidName) {
      return;
    }
    try {
      const foo = await foosClient.addFoo(state.name);
      commit(types.ADD_FOO, foo);
      commit(types.UPDATE_FOO_NAME, '');
      commit(types.RESET_ERROR);
    } catch (error) {
      commit(types.SET_ERROR, error);
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
