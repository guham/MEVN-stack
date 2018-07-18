import Vuex from 'vuex';
import axios from 'axios';
import FooPanel from '@/views/FooPanel.vue';
import foos from '@/store/modules/foos';
import factory from '../factory';

const store = new Vuex.Store({
  modules: {
    foos,
  },
});

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

axios.get.mockImplementation(() => Promise.resolve({
  data: [
    {
      _id: '5afa40240b166302e57ca0a0',
      name: 'name 1',
      createdAt: '2018-05-14T02:04:20.561Z',
      updatedAt: '2018-05-15T06:12:25.561Z',
      __v: 0,
    },
    {
      _id: '5afa446c1870de01d68fe0d6',
      name: 'name 2',
      createdAt: '2018-05-15T03:35:51.523Z',
      updatedAt: '2018-05-15T03:35:51.523Z',
      __v: 0,
    },
  ],
}));

describe('FooPanel.vue', () => {
  test('when the view is initialized, there are no foos', () => {
    const wrapper = factory(FooPanel, store);
    expect(wrapper.find('p').text()).toBe('Count: 0');
  });

  test('has a created hook', () => {
    expect(typeof FooPanel.created).toBe('function');
  });

  test('once created, an API call is done', async () => {
    const wrapper = factory(FooPanel, store);
    await wrapper.vm.fetchFoos();
    expect(axios.get).toBeCalled();
  });

  test('API endpoint should be called with "/api/foo"', async () => {
    const wrapper = factory(FooPanel, store);
    await wrapper.vm.fetchFoos();
    expect(axios.get).toHaveBeenCalledWith('/api/foo', {});
  });

  test('once created, renders foos count value', async () => {
    const wrapper = factory(FooPanel, store);
    await wrapper.vm.fetchFoos();
    expect(wrapper.find('p').text()).toBe('Count: 2');
  });

  test('has the expected html structure', () => {
    const wrapper = factory(FooPanel, store);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
