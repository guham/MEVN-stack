import App from '@/App.vue';
import factory from './factory';

describe('App.vue', () => {
  test('#app is define', () => {
    const wrapper = factory(App);
    expect(wrapper.find('app')).toBeDefined();
  });

  test('has the expected html structure', () => {
    const wrapper = factory(App);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
