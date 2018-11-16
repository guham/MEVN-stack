import { config } from '@vue/test-utils';
import TransitionSlideUp from '@/components/TransitionSlideUp.vue';
import factory from '../factory';
import ExtendedTransitionStub from '../stubs/ExtendedTransitionStub';

// https://github.com/vuejs/vue-test-utils/issues/890#issuecomment-412817945
config.stubs.transition = ExtendedTransitionStub;

describe('TransitionSlideUp.vue', () => {
  test('has the expected html structure', () => {
    const duration = 300;
    const wrapper = factory(TransitionSlideUp, {}, { duration });
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });

  test('hooks should be called', () => {
    const duration = 300;
    const wrapper = factory(TransitionSlideUp, {}, { duration });

    const transition = wrapper.find({ name: 'ExtendedTransitionStub' });
    transition.vm.triggerEnterHooks();
    transition.vm.triggerLeaveHooks();
  });
});
