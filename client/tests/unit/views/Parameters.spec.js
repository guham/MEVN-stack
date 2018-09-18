import Parameters from '@/views/Parameters.vue';
import factory from '../factory';

describe('Parameters.vue', () => {
  test('use LocaleChanger component', () => {
    const wrapper = factory(Parameters);
    const { LocaleChanger } = wrapper.vm.$options.components;
    expect(LocaleChanger).toBeDefined();
  });

  test('has the expected html structure', () => {
    const wrapper = factory(Parameters);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
