import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Test from '@/views/Test';
import NotFound from '@/views/NotFound';

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
