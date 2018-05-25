import Home from '@/views/Home.vue';
import factory from '../factory';

describe('Home.vue ', () => {
  it('use HelloWorld component', () => {
    const wrapper = factory(Home);
    const { HelloWorld } = wrapper.vm.$options.components;
    expect(HelloWorld).toBeDefined();
  });
});
