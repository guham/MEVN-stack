import Vue from 'vue';
import Vuex from 'vuex';
import foos from './modules/foos';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    foos,
    user,
  },
});

/* eslint-disable global-require */
if (module.hot) {
  module.hot.accept([
    './modules/foos',
    './modules/user'], () => {
    const newFoos = require('./modules/foos').default;
    const newUser = require('./modules/user').default;
    store.hotUpdate({
      modules: {
        newFoos,
        newUser,
      },
    });
  });
}

export default store;
