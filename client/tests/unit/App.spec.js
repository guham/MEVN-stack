import Vuex from 'vuex';
import App from '@/App.vue';
import user from '@/store/modules/user';
import factory from './factory';

describe('App.vue', () => {
  const store = new Vuex.Store({
    modules: {
      user: {
        namespaced: user.namespaced,
        getters: {
          isAuthenticated: () => false,
        },
      },
    },
  });
  test('#app is define', () => {
    const wrapper = factory(App, store);
    expect(wrapper.find('app')).toBeDefined();
  });

  test('has the expected html structure', () => {
    const wrapper = factory(App, store);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
