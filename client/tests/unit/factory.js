import { shallowMount } from '@vue/test-utils';

export default (component, propsData = {}, data = {}) => shallowMount(component, {
  propsData: { ...propsData },
  data: { ...data },
});
