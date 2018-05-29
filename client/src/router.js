import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Test from '@/views/Test.vue';
import NotFound from '@/views/NotFound.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/test',
      name: 'Test',
      component: Test,
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
});
