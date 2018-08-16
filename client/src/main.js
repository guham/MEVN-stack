import Vue from 'vue';
import client from '@/api/client';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import auth from '@/auth';
import i18n from '@/i18n';
import './assets/app.css';

Vue.use(auth, {
  store,
  authOptions: {
    client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
    ux_mode: 'popup', // @TODO: use "redirect"
  },
});

client.interceptors.request.use((config) => {
  const defaultConfig = config;

  if (store.getters['user/isAuthenticated']) {
    defaultConfig.headers = {
      Authorization: `Bearer ${store.getters['user/token']}`,
    };
  }

  return defaultConfig;
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
