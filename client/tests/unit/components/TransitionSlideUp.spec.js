import TransitionSlideUp from '@/components/TransitionSlideUp.vue';
import factory from '../factory';

describe('TransitionSlideUp.vue', () => {
  test('has the expected html structure', () => {
    const duration = 300;
    const wrapper = factory(TransitionSlideUp, {}, { duration });
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
