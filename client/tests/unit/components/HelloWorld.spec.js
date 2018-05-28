import HelloWorld from '@/components/HelloWorld.vue';
import factory from '../factory';

describe('HelloWorld.vue', () => {
  test('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = factory(HelloWorld, { msg });
    expect(wrapper.find('h1').text()).toBe(msg);
  });

  test('has the expected html structure', () => {
    const wrapper = factory(HelloWorld);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
