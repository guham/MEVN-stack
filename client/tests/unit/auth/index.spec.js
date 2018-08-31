import Vue from 'vue';
import { createLocalVue } from '@vue/test-utils';
import auth from '@/auth';
import store from '@/store';
import userStore from '@/store/modules/user';
import Vuex from 'vuex';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe('Auth plugin', () => {
  test('throws an error if a Vuex store is not passed as plugin option', () => {
    const localVue = createLocalVue();
    try {
      localVue.use(auth);
    } catch (error) {
      expect(error.message).toBe('A valid Vuex store is required.');
    }

    try {
      localVue.use(auth, {
        store: {},
      });
    } catch (error) {
      expect(error.message).toBe('A valid Vuex store is required.');
    }
  });

  test('adds an $auth Vue instance to the Vue prototype', () => {
    const localVue = createLocalVue();
    localVue.use(auth, {
      store,
    });
    expect(localVue.prototype.$auth instanceof Vue).toBeTruthy();
    expect(localVue.prototype.$auth.$options.store).toBeDefined();
  });

  test('calls `user` store mutation `SET_USER_AUTHENTICATED` if user is logged', (done) => {
    window.gapi.auth2.isSignedIn.get.mockImplementationOnce(() => true);
    const mutations = {
      SET_USER_AUTHENTICATED: jest.fn(),
    };

    const authStore = new Vuex.Store({
      modules: {
        user: {
          namespaced: userStore.namespaced,
          mutations,
        },
      },
    });

    const localVue = createLocalVue();
    localVue.use(auth, {
      store: authStore,
    });

    localVue.prototype.$auth.$nextTick(() => {
      expect(mutations.SET_USER_AUTHENTICATED).toHaveBeenCalled();
      done();
    });
  });
});
