import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue';
import user from '@/store/modules/user';
import factory from '../../factory';

describe('GoogleSignInButton.vue', () => {
  let store;
  let actions;

  beforeEach(() => {
    actions = {
      signIn: jest.fn(),
      signOut: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        user: {
          namespaced: user.namespaced,
          state: user.state,
          getters: user.getters,
          mutations: user.mutations,
          actions,
        },
      },
    });
  });

  test('should display Sign In button when user in not logged', () => {
    const wrapper = factory(GoogleSignInButton, store);
    expect(wrapper.vm.isAuthenticated).toBeFalsy();
    expect(wrapper.find('#btn-signin').isVisible()).toBeTruthy();
    expect(wrapper.find('#btn-signout').length).toBeFalsy();
  });

  test('should display Sign Out button when user is logged', () => {
    store = new Vuex.Store({
      modules: {
        user: {
          namespaced: user.namespaced,
          state: user.state,
          getters: {
            isAuthenticated: () => true,
          },
          mutations: user.mutations,
          actions,
        },
      },
    });

    const wrapper = factory(GoogleSignInButton, store);
    expect(wrapper.vm.isAuthenticated).toBeTruthy();
    expect(wrapper.find('#btn-signout').isVisible()).toBeTruthy();
    expect(wrapper.find('#btn-signin').length).toBeFalsy();
  });

  test('calls store action `signIn` when Sign In button is clicked', () => {
    const wrapper = factory(GoogleSignInButton, store);
    wrapper.find('#btn-signin').trigger('click');
    expect(actions.signIn).toHaveBeenCalled();
  });

  test('emit `signIn` event when Sign In button is clicked', async () => {
    const wrapper = factory(GoogleSignInButton, store);
    wrapper.find('#btn-signin').trigger('click');
    await flushPromises();
    expect(wrapper.emitted('signIn')).toBeTruthy();
    expect(wrapper.emitted('signIn').length).toBe(1);
    expect(wrapper.emitted('signIn')[0]).toEqual([]);
  });

  test('calls store action `signOut` when Sign Out button is clicked', async () => {
    store = new Vuex.Store({
      modules: {
        user: {
          namespaced: user.namespaced,
          state: user.state,
          getters: {
            isAuthenticated: () => true,
          },
          mutations: user.mutations,
          actions,
        },
      },
    });

    const wrapper = factory(GoogleSignInButton, store);
    const spySignOutAndRedirect = jest.spyOn(wrapper.vm, 'signOutAndRedirect');
    const spyRouterReplace = jest.spyOn(wrapper.vm.$router, 'replace');

    wrapper.find('#btn-signout').trigger('click');
    await flushPromises();
    expect(spySignOutAndRedirect).toHaveBeenCalled();
    expect(actions.signOut).toHaveBeenCalled();
    expect(spyRouterReplace).toHaveBeenCalledWith({ name: 'Home', params: {}, path: '' });
  });

  test('has the expected html structure', () => {
    const wrapper = factory(GoogleSignInButton, store);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
