import * as types from '@/store/mutation-types';

const state = {
  notification: {},
};

const getters = {
  hasNotification: state => Object.keys(state.notification).length > 0,
};

const mutations = {
  [types.ADD_NOTIFICATION](state, notification) {
    state.notification = notification;
  },

  [types.REMOVE_NOTIFICATION](state) {
    state.notification = {};
  },
};

const actions = {
  addThenRemoveNotification: {
    root: true,
    handler({ dispatch, commit }, notification) {
      notification.timer = setTimeout(() => {
        dispatch('removeNotification');
      }, 8000);
      commit(types.ADD_NOTIFICATION, notification);
    },
  },
  removeNotification({ commit, state }) {
    clearTimeout(state.notification.timer);
    commit(types.REMOVE_NOTIFICATION);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
