import Vuex from 'vuex';
import App from '@/App.vue';
import user from '@/store/modules/user';
import factory from './factory';

let store = new Vuex.Store({
  modules: {
    user: {
      namespaced: user.namespaced,
      getters: {
        isAuthenticated: () => false,
      },
    },
  },
});

describe('App.vue', () => {
  test('#app is define', () => {
    const wrapper = factory(App, store);
    expect(wrapper.find('app')).toBeDefined();
  });

  test('should display only "Home" link when the user is not authenticated', () => {
    const wrapper = factory(App, store);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });

  test('should display restricted links when the user is authenticated', () => {
    store = new Vuex.Store({
      modules: {
        user: {
          namespaced: user.namespaced,
          getters: {
            isAuthenticated: () => true,
          },
        },
      },
    });
    const wrapper = factory(App, store);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
