import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import i18n from '@/i18n';
import vClickOutside from 'v-click-outside';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
localVue.use(VueI18n);
localVue.use(vClickOutside);

const router = new VueRouter({
  mode: 'history',
});

export default (component, store = {}, propsData = {}, data = {}, stubs = []) =>
  shallowMount(component, {
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
