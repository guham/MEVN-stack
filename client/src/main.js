import Vue from 'vue';
import client from '@/api/client';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import auth from '@/auth';
import i18n from '@/i18n';
import './assets/app.css';

Vue.config.productionTip = false;

const authOptions = {
  client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
  ux_mode: 'popup', // @todo: use "redirect"
};

client.interceptors.request.use((config) => {
  const defaultConfig = config;

  if (store.getters['user/isAuthenticated']) {
    defaultConfig.headers = {
      ...defaultConfig.headers,
      Authorization: `Bearer ${store.getters['user/accessToken']}`,
    };
  }

  return defaultConfig;
}, error => Promise.reject(error));

let unauthorizedInterceptor;
const AddUnauthorizedInterceptor = () => client.interceptors.response.use(null, async (error) => {
  const originalRequest = error.config;

  const shouldRefreshToken = [401, 403].includes(error.status)
    && originalRequest
    && store.getters['user/isAuthenticated']
    && store.getters['user/accessToken'] !== null
    && store.getters['user/refreshToken'] !== null;

  if (shouldRefreshToken) {
    client.interceptors.response.eject(unauthorizedInterceptor);
    try {
      await store.dispatch('user/refreshTokens');
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${store.getters['user/accessToken']}`,
      };
      return Promise.resolve(client.request(originalRequest));
    } catch (e) {
      router.replace({ name: 'Home' });
    } finally {
      unauthorizedInterceptor = AddUnauthorizedInterceptor();
    }
  }
  return Promise.reject(error);
});
unauthorizedInterceptor = AddUnauthorizedInterceptor();

window.gapi.load('auth2', async () => {
  try {
    await window.gapi.auth2.init(authOptions);
  } catch (error) {
    // e2e tests: app URL is not allowed (cf. Authorized origins in Google OAuth 2.0 client)
  }

  Vue.use(auth, {
    store,
  });

  new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
  }).$mount('#app');
});
