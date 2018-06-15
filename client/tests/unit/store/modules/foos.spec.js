import axios from 'axios';
import foosStore from '@/store/modules/foos';
import testAction from '../../test-action';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

const foo = {
  _id: '5afa40240b166302e57ca0a0',
  name: 'new foo',
};

const foos = [
  {
    _id: '5afa40240b166302e57ca0a0',
    name: 'name 1',
  },
  {
    _id: '5afa446c1870de01d68fe0d6',
    name: 'name 2',
  },
];

const error = {
  status: 500,
  statusText: 'Internal Server Error',
  data: {
    message: 'Error message',
  },
};

describe('Foos store', () => {
  describe('getters', () => {
    test('`count` returns state.foos length', () => {
      const state = {
        foos,
      };
      expect(foosStore.getters.count(state)).toEqual(2);
    });

    test('`error` returns state.error', () => {
      const state = {
        error: {},
      };
      expect(foosStore.getters.error(state)).toEqual(state.error);
    });

    test('`isValidName` returns true if state.name length > 0', () => {
      const state = {
        name: 'valid name',
      };
      expect(foosStore.getters.isValidName(state)).toBeTruthy();
    });

    test('`isValidName` returns false if state.name is empty', () => {
      const state = {
        name: '',
      };
      expect(foosStore.getters.isValidName(state)).toBeFalsy();
    });

    test('`hasError` returns true if state.error object has keys', () => {
      const state = {
        error,
      };
      expect(foosStore.getters.hasError(state)).toBeTruthy();
    });

    test('`hasError` returns false if state.error is an empty object', () => {
      const state = {
        error: {},
      };
      expect(foosStore.getters.hasError(state)).toBeFalsy();
    });
  });

  describe('mutations', () => {
    test('FETCH_FOOS', () => {
      const state = {
        foos: [],
      };
      foosStore.mutations.FETCH_FOOS(state, foos);
      expect(state.foos).toEqual(foos);
    });

    test('ADD_FOO', () => {
      const state = {
        foos: [],
      };
      foosStore.mutations.ADD_FOO(state, foo);
      expect(state.foos).toContain(foo);
    });

    test('UPDATE_FOO_NAME', () => {
      const state = {
        name: '',
      };
      foosStore.mutations.UPDATE_FOO_NAME(state, ' foo name will be trimmed   ');
      expect(state.name).toBe('foo name will be trimmed');
    });

    test('SET_ERROR', () => {
      const state = {
        error: {},
      };
      foosStore.mutations.SET_ERROR(state, error);
      expect(state.error).toEqual(error);
    });

    test('RESET_ERROR', () => {
      const state = {
        error,
      };
      foosStore.mutations.RESET_ERROR(state);
      expect(state.error).toEqual({});
    });
  });

  describe('actions', () => {
    test('fetchFoos - fetch all foos', (done) => {
      axios.get.mockImplementation(() => Promise.resolve({
        data: foos,
      }));

      testAction(foosStore.actions.fetchFoos, null, {}, {}, [
        { type: 'FETCH_FOOS', payload: foos },
      ], done);
    });

    test('addFoo - add a valid foo', (done) => {
      axios.post.mockImplementation(() => Promise.resolve({
        data: foo,
      }));

      testAction(foosStore.actions.addFoo, null, { name: 'new foo' }, { isValidName: true }, [
        { type: 'ADD_FOO', payload: foo },
        { type: 'UPDATE_FOO_NAME', payload: '' },
        { type: 'RESET_ERROR' },
      ], done);
    });

    test('addFoo - add an unvalid foo', (done) => {
      expect.assertions(1);
      testAction(foosStore.actions.addFoo, null, { name: '' }, { isValidName: false }, [], done);
    });

    test('addFoo - error from API', (done) => {
      axios.post.mockImplementation(() => Promise.reject(error));

      testAction(foosStore.actions.addFoo, null, { name: 'valid foo name but already exist in DB' }, { isValidName: true }, [
        { type: 'SET_ERROR', payload: error },
      ], done);
    });
  });
});
