import * as api from '@/api/foos';
import * as types from '../mutation-types';

const state = {
  foos: [],
};

const getters = {
  count: state => state.foos.length,
};

const mutations = {
  [types.FETCH_FOOS](state, foos) {
    state.foos = foos;
  },

  [types.ADD_FOO](state, foo) {
    state.foos.push(foo);
  },
};

const actions = {
  async fetchFoos({ commit }) {
    const foos = await api.fetchFoos();
    commit(types.FETCH_FOOS, foos);
  },

  async addFoo({ commit }, name) {
    const foo = await api.addFoo(name);
    commit(types.ADD_FOO, foo);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
