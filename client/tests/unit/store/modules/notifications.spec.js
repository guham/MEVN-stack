import notifications from '@/store/modules/notifications';
import Notification from '@/models/notification';
import testAction from '../../test-action';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe('Notifications store', () => {
  describe('getters', () => {
    test('`hasNotification` returns false if state.notification is an empty object', () => {
      const state = {
        notification: {},
      };
      expect(notifications.getters.hasNotification(state)).toBe(false);
    });

    test('`hasNotification` returns true if there is a notification to display', () => {
      const state = {
        notification: new Notification(),
      };
      expect(notifications.getters.hasNotification(state)).toBe(true);
    });
  });

  describe('mutations', () => {
    test('ADD_NOTIFICATION', () => {
      const state = {
        notification: {},
      };
      const notification = new Notification();
      notifications.mutations.ADD_NOTIFICATION(state, notification);
      expect(state.notification).toBe(notification);
    });

    test('REMOVE_NOTIFICATION', () => {
      const state = {
        notification: new Notification(),
      };
      notifications.mutations.REMOVE_NOTIFICATION(state);
      expect(state.notification).toEqual({});
    });
  });

  describe('actions', () => {
    test('removeNotification - remove notification', (done) => {
      const notification = new Notification();
      notification.timer = 550; // random timeoutId
      const state = {
        notification,
      };
      testAction(notifications.actions.removeNotification, null, state, {}, [
        { type: 'REMOVE_NOTIFICATION' },
      ], [], done);
    });

    test('addThenRemoveNotification - manage notification ', (done) => {
      const notification = new Notification();
      testAction(notifications.actions.addThenRemoveNotification, notification, {}, {}, [
        { type: 'ADD_NOTIFICATION', payload: notification },
      ], [
        { type: 'removeNotification' },
      ], done);
      jest.runAllTimers();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 8000);
    });
  });
});
