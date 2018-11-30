import Vue from 'vue';
import Vuex from 'vuex';
import foos from './modules/foos';
import user from './modules/user';
import notifications from './modules/notifications';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    foos,
    user,
    notifications,
  },
});

/* eslint-disable global-require */
if (module.hot) {
  module.hot.accept([
    './modules/foos',
    './modules/user',
    './modules/notifications'], () => {
    const newFoos = require('./modules/foos').default;
    const newUser = require('./modules/user').default;
    const newNotifications = require('./modules/notifications').default;
    store.hotUpdate({
      modules: {
        newFoos,
        newUser,
        newNotifications,
      },
    });
  });
}

export default store;
