import NotFound from '@/views/NotFound';
import factory from '../factory';

describe('NotFound.vue', () => {
  test('has the expected html structure', () => {
    const wrapper = factory(NotFound);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
