import Home from '@/views/Home';
import factory from '../factory';

describe('Home.vue', () => {
  test('use HelloWorld component', () => {
    const wrapper = factory(Home);
    const { HelloWorld } = wrapper.vm.$options.components;
    expect(HelloWorld).toBeDefined();
  });

  test('has the expected html structure', () => {
    const wrapper = factory(Home);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
