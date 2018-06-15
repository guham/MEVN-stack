import Vuex from 'vuex';
import AddFoo from '@/components/AddFoo.vue';
import foos from '@/store/modules/foos';
import * as types from '@/store/mutation-types';
import factory from '../factory';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe('AddFoo.vue', () => {
  let store;
  let actions;
  let mutations;

  beforeEach(() => {
    actions = {
      addFoo: jest.fn(),
    };

    mutations = {
      [types.UPDATE_FOO_NAME]: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        foos: {
          namespaced: foos.namespaced,
          state: foos.state,
          getters: foos.getters,
          mutations,
          actions,
        },
      },
    });
  });

  test('renders default props.placeholder', () => {
    const wrapper = factory(AddFoo, {}, {}, [], store);
    expect(wrapper.find('input').element.placeholder).toBe('Default placeholder');
  });

  test('renders props.placeholder when passed', () => {
    const placeholder = 'custom placeholder';
    const wrapper = factory(AddFoo, { placeholder }, {}, [], store);
    expect(wrapper.find('input').element.placeholder).toBe(placeholder);
  });

  test('renders state.name default value in input', () => {
    const wrapper = factory(AddFoo, {}, {}, [], store);
    expect(wrapper.find('input').element.value).toBe(foos.state.name);
  });

  test('should not display error panel when there are no errors', () => {
    const wrapper = factory(AddFoo, {}, {}, [], store);
    expect(wrapper.vm.hasError).toBeFalsy();
    expect(wrapper.find('#error').length).toBeFalsy();
  });

  test('should display error panel when there is an error', () => {
    store = new Vuex.Store({
      modules: {
        foos: {
          namespaced: foos.namespaced,
          state: foos.state,
          getters: {
            error: () => ({
              data: {
                message: 'error message',
              },
            }),
            hasError: () => true,
          },
          mutations,
          actions,
        },
      },
    });

    const wrapper = factory(AddFoo, {}, {}, [], store);
    expect(wrapper.vm.hasError).toBeTruthy();
    expect(wrapper.find('#error').isVisible()).toBeTruthy();
    expect(wrapper.find('#error > p').text()).toBe('error message');
  });

  test('calls store mutation `UPDATE_FOO_NAME` when input value is updated', () => {
    const value = 'new value';
    const wrapper = factory(AddFoo, {}, {}, [], store);
    const input = wrapper.find('input');
    input.element.value = value;
    input.trigger('input');
    expect(mutations.UPDATE_FOO_NAME).toHaveBeenCalled();
  });

  test('calls store action `addFoo` when button is clicked', () => {
    const wrapper = factory(AddFoo, {}, {}, [], store);
    wrapper.find('button').trigger('click');
    expect(actions.addFoo).toHaveBeenCalled();
  });

  test('calls store action `addFoo` when event `keyup.enter` is fired', () => {
    const wrapper = factory(AddFoo, {}, {}, [], store);
    wrapper.find('input').trigger('keyup.enter');
    expect(actions.addFoo).toHaveBeenCalled();
  });

  test('has the expected html structure', () => {
    const wrapper = factory(AddFoo, {}, {}, [], store);
    const template = wrapper.html();
    expect(template).toMatchSnapshot();
  });
});
