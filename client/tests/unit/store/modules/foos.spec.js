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

describe('Foos store', () => {
  describe('getters', () => {
    test('count() returns state.foos length', () => {
      const state = {
        foos,
      };
      expect(foosStore.getters.count(state)).toEqual(2);
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
  });

  describe('actions', () => {
    test('fetchFoos - fetch all foos', (done) => {
      axios.get.mockImplementation(() => Promise.resolve({
        data: foos,
      }));

      testAction(foosStore.actions.fetchFoos, null, {}, [
        { type: 'FETCH_FOOS', payload: foos },
      ], done);
    });

    test('addFoo - add a new foo', (done) => {
      axios.post.mockImplementation(() => Promise.resolve({
        data: foo,
      }));

      testAction(foosStore.actions.addFoo, 'new foo', {}, [
        { type: 'ADD_FOO', payload: foo },
      ], done);
    });
  });
});
