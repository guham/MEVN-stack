import axios from 'axios';
import Test from '@/views/Test.vue';
import factory from '../factory';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe('Test.vue ', () => {
  test('renders a default message', () => {
    const wrapper = factory(Test);
    expect(wrapper.find('p').text()).toBe('>> Waiting for value...');
  });

  test('has a mounted hook', () => {
    expect(typeof Test.mounted).toBe('function');
  });

  test('once mounted, should renders the value fetched from the API', async () => {
    const wrapper = factory(Test);
    await wrapper.vm.fetchValueFromServer();
    expect(wrapper.find('p').text()).toBe('>> This is a value fetched from server');
  });

  test('API endpoint should be called with "api/foo/test"', async () => {
    const wrapper = factory(Test);
    await wrapper.vm.fetchValueFromServer();
    expect(axios.get).toBeCalledWith('api/foo/test');
  });

  test("renders error's message when an error occurs", async () => {
    const wrapper = factory(Test);
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('Error')));
    await wrapper.vm.fetchValueFromServer();
    expect(wrapper.find('p').text()).toBe('>> Error');
  });
});
