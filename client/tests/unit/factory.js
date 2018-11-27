import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import i18n from '@/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
localVue.use(VueI18n);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
    },
    {
      path: '/test',
      name: 'Test',
    },
    {
      path: '/foos',
      name: 'FooPanel',
    },
    {
      path: '/404',
      name: 'NotFound',
    },
    {
      path: '/parameters',
      name: 'Parameters',
    },
  ],
});

export default (
  component,
  store = {},
  propsData = {},
  data = {},
  stubs = {},
) => shallowMount(component, {
  propsData: { ...propsData },
  data: () => ({ ...data }),
  stubs,
  localVue,
  store,
  router,
  i18n,
  mocks: {
    $t: keypath => keypath,
    $tc: keypath => keypath,
  },
});
