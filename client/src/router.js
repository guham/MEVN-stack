import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Home from '@/views/Home.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import(/* webpackChunkName: "test" */ '@/views/Test.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/foo',
      name: 'FooPanel',
      component: () => import(/* webpackChunkName: "foo" */ '@/views/FooPanel.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import(/* webpackChunkName: "error" */ '@/views/NotFound.vue'),
    },
    {
      path: '/parameters',
      name: 'Parameters',
      component: () => import(/* webpackChunkName: "parameters" */ '@/views/Parameters.vue'),
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
});

router.beforeEach((to, from, next) => {
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
});

export default router;
