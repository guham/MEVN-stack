import Vue from 'vue';
import Router from 'vue-router';
/* import store from '@/store'; */
import Home from '@/views/Home.vue';
import Test from '@/views/Test.vue';
import FooPanel from '@/views/FooPanel.vue';
import NotFound from '@/views/NotFound.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
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
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/foo',
      name: 'FooPanel',
      component: FooPanel,
      meta: {
        requiresAuth: true,
      },
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

/* router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    if (!store.getters['user/isAuthenticated']) {
      next({
        path: '/',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
}); */

export default router;
