import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
});

export default (component, propsData = {}, data = {}, stubs = [], store = {}) =>
  shallowMount(component, {
    propsData: { ...propsData },
    data: { ...data },
    stubs,
    localVue,
    store,
    router,
  });
