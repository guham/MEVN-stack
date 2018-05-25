import HelloWorld from '@/components/HelloWorld.vue';
import factory from '../factory';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = factory(HelloWorld, { msg });
    expect(wrapper.find('h1').text()).toBe(msg);
  });
});
