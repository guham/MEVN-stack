import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';
import nprogress from 'nprogress';
import store from '@/store';
import Home from '@/views/Home.vue';
import './assets/nprogress.css';

Vue.use(Router);
Vue.use(Meta, {
  keyName: 'metaInfo',
});

nprogress.configure({
  easing: 'ease',
  speed: 300,
  showSpinner: false,
  template: `<div class="progress-bar pointer-events-none fixed pin-t pin-l w-full z-50 bg-green-dark" role="bar">
    <div class="peg block absolute pin-r h-full opacity-100"></div></div>`,
});

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
  if (from.name) {
    nprogress.start();
  }
  next();
});

router.afterEach(() => {
  nprogress.done();
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
