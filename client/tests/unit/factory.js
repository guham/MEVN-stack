import { shallowMount } from '@vue/test-utils';

export default (component, propsData = {}, data = {}, stubs = []) => shallowMount(component, {
  propsData: { ...propsData },
  data: { ...data },
  stubs,
});
