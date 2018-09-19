import Vue from 'vue';
import client from '@/api/client';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import auth from '@/auth';
import i18n from '@/i18n';
import vClickOutside from 'v-click-outside';
import './assets/app.css';

Vue.config.productionTip = false;

const authOptions = {
  client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
  ux_mode: 'popup', // @TODO: use "redirect"
};

client.interceptors.request.use((config) => {
  const defaultConfig = config;

  if (store.getters['user/isAuthenticated']) {
    defaultConfig.headers = {
      Authorization: `Bearer ${store.getters['user/token']}`,
    };
  }

  return defaultConfig;
});

window.gapi.load('auth2', async () => {
  try {
    await window.gapi.auth2.init(authOptions);
  } catch (error) {
    // e2e tests: app URL is not allowed (cf. Authorized origins in Google OAuth 2.0 client)
  }

  Vue.use(auth, {
    store,
  });

  Vue.use(vClickOutside);

  new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
  }).$mount('#app');
});
