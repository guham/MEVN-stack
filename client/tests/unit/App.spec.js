import Vuex from 'vuex';
import App from '@/App.vue';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue';
import NotificationComponent from '@/components/Notification.vue';
import user from '@/store/modules/user';
import notifications from '@/store/modules/notifications';
import Notification from '@/models/notification';
import factory from './factory';

const notificationsModule = {
  namespaced: notifications.namespaced,
  state: notifications.state,
  getters: notifications.getters,
  actions: notifications.actions,
};

const userUnauthenticatedStore = new Vuex.Store({
  modules: {
    user: {
      namespaced: user.namespaced,
      getters: {
        isAuthenticated: () => false,
        userIsSigningIn: () => false,
      },
    },
    notifications: notificationsModule,
  },
});

const userAuthenticatedStore = new Vuex.Store({
  modules: {
    user: {
      namespaced: user.namespaced,
      getters: {
        isAuthenticated: () => true,
        userIsSigningIn: () => false,
      },
    },
    notifications: notificationsModule,
  },
});

describe('App.vue', () => {
  test('#app is define', () => {
    const wrapper = factory(App, userUnauthenticatedStore);
    expect(wrapper.find('app')).toBeDefined();
  });

  test('should display "Home" and "Parameters" links when the user is not authenticated', () => {
    const wrapper = factory(App, userUnauthenticatedStore);
    const template = wrapper.html();
    const links = wrapper.findAll('routerlinkwrapper-stub');
    expect(links).toHaveLength(3);
    expect(links.at(0).props().to).toBe('/');
    expect(links.at(1).props().to).toBe('/');
    expect(links.at(2).props().to).toBe('/parameters');
    expect(template).toMatchSnapshot();
  });

  test('should display restricted links when the user is authenticated', () => {
    const wrapper = factory(App, userAuthenticatedStore);
    const template = wrapper.html();
    const links = wrapper.findAll('routerlinkwrapper-stub');
    expect(links.filter(link => link.props().to === '/test').isVisible()).toBeTruthy();
    expect(links.filter(link => link.props().to === '/foos').isVisible()).toBeTruthy();
    expect(template).toMatchSnapshot();
  });

  test('toggle menu when open/close button is clicked', (done) => {
    const wrapper = factory(App, userUnauthenticatedStore);
    wrapper.vm.$router.push('/');
    expect(wrapper.vm.menuIsVisible).toBeFalsy();
    const button = wrapper.find('#menu-open > button');
    expect(button).toBeDefined();
    button.trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.menuIsVisible).toBeTruthy();
      done();
    });
  });

  test('should collapse the menu on route change', (done) => {
    const wrapper = factory(App, userUnauthenticatedStore);
    wrapper.vm.$router.push('/');
    // user opened the menu
    wrapper.vm.menuIsVisible = true;
    expect(wrapper.find('#menu-close').isVisible()).toBeTruthy();
    // user clicked on parameters link
    wrapper.vm.$router.push('/parameters');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.menuIsVisible).toBeFalsy();
      done();
    });
  });

  test('calls `closeMenu()` when @signIn happens', (done) => {
    const wrapper = factory(App, userUnauthenticatedStore);
    const spyCloseMenu = jest.spyOn(wrapper.vm, 'closeMenu');
    wrapper.find(GoogleSignInButton).vm.$emit('signIn');
    wrapper.vm.$nextTick(() => {
      expect(spyCloseMenu).toHaveBeenCalled();
      done();
    });
  });

  test('should display a notification when one is added to the Notifications store', (done) => {
    const notificationStore = new Vuex.Store({
      modules: {
        user,
        notifications: {
          ...notificationsModule,
          ...{ state: { notification: new Notification() } },
        },
      },
    });

    const wrapper = factory(App, notificationStore);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find(NotificationComponent).isVisible()).toBeTruthy();
      done();
    });
  });

  test('calls store action `removeNotification` when @removeNotification happens', (done) => {
    const actions = {
      removeNotification: jest.fn(),
    };
    const notificationStore = new Vuex.Store({
      modules: {
        user,
        notifications: {
          ...notificationsModule,
          ...{ state: { notification: new Notification() } },
          ...{ actions },
        },
      },
    });

    const wrapper = factory(App, notificationStore);
    wrapper.find(NotificationComponent).vm.$emit('removeNotification');
    wrapper.vm.$nextTick(() => {
      expect(actions.removeNotification).toHaveBeenCalled();
      done();
    });
  });
});
