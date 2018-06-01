import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();

localVue.use(Vuex);

export default (component, propsData = {}, data = {}, stubs = [], store = {}) =>
  shallowMount(component, {
    propsData: { ...propsData },
    data: { ...data },
    stubs,
    store,
    localVue,
  });
