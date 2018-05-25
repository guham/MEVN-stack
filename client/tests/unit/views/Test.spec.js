import Test from '@/views/Test.vue';
import factory from '../factory';

describe('Test.vue ', () => {
  it('renders a default message', () => {
    const wrapper = factory(Test);
    expect(wrapper.find('p').text()).toBe('>> Waiting for value...');
  });
});
