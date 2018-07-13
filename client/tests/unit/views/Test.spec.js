import axios from 'axios';
import Test from '@/views/Test.vue';
import factory from '../factory';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

axios.get.mockImplementation(() => Promise.resolve({ data: { data: 'message from the API' } }));

describe('Test.vue', () => {
  test('renders a default message', () => {
    const wrapper = factory(Test);
    expect(wrapper.find('p').text()).toBe('>> Waiting for value...');
  });

  test('has a mounted hook', () => {
    expect(typeof Test.mounted).toBe('function');
  });

  test('once mounted, an API call is done', async () => {
    const wrapper = factory(Test);
    await wrapper.vm.fetchValueFromServer();
    expect(axios.get).toBeCalled();
  });

  test('once mounted, should renders the value fetched from the API', async () => {
    const wrapper = factory(Test);
    await wrapper.vm.fetchValueFromServer();
    expect(wrapper.find('p').text()).toBe('>> message from the API');
  });

  test('API endpoint should be called with "/api/foo/test"', async () => {
    const wrapper = factory(Test);
    await wrapper.vm.fetchValueFromServer();
    expect(axios.get).toHaveBeenCalledWith('/api/foo/test', {});
  });

  test("renders error's message when an error occurs", async () => {
    const wrapper = factory(Test);
    axios.get.mockImplementation(() => Promise.reject(new Error('Error')));
    await wrapper.vm.fetchValueFromServer();
    expect(wrapper.find('p').text()).toBe('>> Error');
  });

  test('has the expected html structure', () => {
    const wrapper = factory(Test);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
