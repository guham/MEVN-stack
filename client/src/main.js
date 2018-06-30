import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import auth from '@/auth';
import './assets/app.css';

Vue.use(auth, {
  store,
  authOptions: {
    client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
    ux_mode: 'popup', // @TODO: use "redirect"
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
