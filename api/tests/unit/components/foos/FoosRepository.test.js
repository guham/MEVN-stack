const factory = require('../../../factory');
const FooModel = require('../../../../src/components/foos/FooModel');
const FoosRepository = require('../../../../src/components/foos/FoosRepository');

const repository = new FoosRepository({ FooModel });

describe('Test Foos repository', () => {
  describe('find', () => {
    test('returns all foos according to the conditions', async () => {
      await factory.createMany('foo', 2, [
        { name: 'foo 1' },
        { name: 'foo 2' },
      ]);
      const foos = await repository.find();
      expect(foos).toHaveLength(2);
      expect(foos[0].name).toBe('foo 1');
      expect(foos[1].name).toBe('foo 2');
    });

    test('returns an empty array if no foo is found', async () => {
      const foos = await repository.find({ name: 'inexistent_foo' });
      expect(foos).toEqual([]);
    });
  });

  describe('add', () => {
    test('persists the foo when foo is valid', async () => {
      const foo = { name: 'new foo' };
      const newFoo = await repository.add([foo]);
      expect(newFoo.name).toEqual(foo.name);
      expect(newFoo._id).toBeDefined();
    });

    test('throws an error if the foo is not valid', async () => {
      const foo = {};
      try {
        await repository.add([foo]);
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    test('throws an error if the added foo is already in database', async () => {
      await factory.create('foo', {
        name: 'foo',
      });
      const foo = { name: 'foo' };
      try {
        await repository.add([foo]);
      } catch (error) {
        expect(error.name).toBe('MongoError');
      }
    });
  });

  describe('getById', () => {
    test('returns the foo if it exists', async () => {
      const foo = await factory.create('foo', {
        name: 'my foo',
      });
      const foundFoo = await repository.getById(foo._id);
      expect(foundFoo._id).toEqual(foo._id);
    });

    test('returns `null` if the foo does not exist', async () => {
      const unsavedFoo = await factory.build('foo', {
        name: 'my foo',
      });
      const foo = await repository.getById(unsavedFoo._id);
      expect(foo).toBeNull();
    });
  });
});
