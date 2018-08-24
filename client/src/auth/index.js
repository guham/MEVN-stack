import Vue from 'vue';
import { createNamespacedHelpers, Store } from 'vuex';
import { SET_USER_AUTHENTICATED } from '@/store/mutation-types';

const { mapMutations } = createNamespacedHelpers('user');

const auth = options => new Vue({
  store: options.store,
  created() {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
      this[SET_USER_AUTHENTICATED]();
    }
  },
  methods: {
    ...mapMutations([
      SET_USER_AUTHENTICATED,
    ]),
  },
});

/* eslint-disable no-shadow, no-param-reassign */
export default {
  install: (Vue, options = {}) => {
    if (!(options.store instanceof Store)) {
      throw new Error('A valid Vuex store is required.');
    }
    Vue.prototype.$auth = auth(options);
  },
};
