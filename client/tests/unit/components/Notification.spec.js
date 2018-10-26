import NotificationComponent from '@/components/Notification.vue';
import Notification from '@/models/notification';
import factory from '../factory';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe('Notification.vue', () => {
  test('has the expected html structure', () => {
    const notification = new Notification();
    const wrapper = factory(NotificationComponent, {}, { notification });
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });

  test('emit `removeNotification` event when Close button is clicked', (done) => {
    const notification = new Notification();
    const wrapper = factory(NotificationComponent, {}, { notification });
    wrapper.find('button').trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('removeNotification')).toBeTruthy();
      expect(wrapper.emitted('removeNotification').length).toBe(1);
      expect(wrapper.emitted('removeNotification')[0]).toEqual([]);
      done();
    });
  });
});
