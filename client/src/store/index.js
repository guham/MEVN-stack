import Vue from 'vue';
import Vuex from 'vuex';
import foos from './modules/foos';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    foos,
  },
});

if (module.hot) {
  module.hot.accept(['./modules/foos'], () => {
    const newFoos = require('./modules/foos').default; // eslint-disable-line global-require
    store.hotUpdate({
      modules: {
        newFoos,
      },
    });
  });
}

export default store;
