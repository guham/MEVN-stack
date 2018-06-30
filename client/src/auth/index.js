import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import { SET_USER_AUTHENTICATED } from '@/store/mutation-types';

const { mapMutations } = createNamespacedHelpers('user');

const auth = (options = {}) => new Vue({
  store: options.store,
  created() {
    window.gapi.load('auth2', async () => {
      const auth2 = await window.gapi.auth2.init(options.authOptions);
      if (auth2.isSignedIn.get()) {
        this[SET_USER_AUTHENTICATED]();
      }
    });
  },
  methods: {
    ...mapMutations([
      SET_USER_AUTHENTICATED,
    ]),
  },
});

/* eslint-disable no-shadow, no-param-reassign */
export default {
  install: (Vue, options) => {
    Vue.prototype.$auth = auth(options);
  },
};
