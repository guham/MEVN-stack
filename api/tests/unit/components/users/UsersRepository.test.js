const factory = require('../../../factory');
const UserModel = require('../../../../src/components/users/UserModel');
const UsersRepository = require('../../../../src/components/users/UsersRepository');

const repository = new UsersRepository({ UserModel });

describe('Test Users repository', () => {
  describe('findOne', () => {
    test('returns the user if exists', async () => {
      const user = await factory.create('user', {
        sub: '123',
      });
      const foundUser = await repository.findOne({ sub: 123 });
      expect(foundUser._id).toEqual(user._id);
      expect(foundUser.name).toEqual(user.name);
      expect(foundUser.sub).toEqual(user.sub);
    });

    test('returns `null` if the user does not exist', async () => {
      const user = await repository.findOne({ sub: 123 });
      expect(user).toBe(null);
    });
  });

  describe('add', () => {
    test('persists the user when user is valid', async () => {
      const user = { sub: '123' };
      const newUser = await repository.add([user]);
      expect(newUser.sub).toEqual(user.sub);
      expect(newUser._id).toBeDefined();
    });

    test('throws an error if the user is not valid', async () => {
      const user = {};
      try {
        await repository.add([user]);
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    test('throws an error if the added user is already in database', async () => {
      await factory.create('user', {
        sub: '123',
      });
      const user = { sub: '123' };
      try {
        await repository.add([user]);
      } catch (error) {
        expect(error.name).toBe('MongoError');
      }
    });
  });

  describe('save', () => {
    test('saves the user and returns the user\'s instance', async () => {
      const user = await factory.create('user', {
        sub: '123',
      });
      user.sub = '456';
      const sameUser = await repository.save(user);
      expect(user).toEqual(sameUser);
    });
  });

  describe('findOrCreate', () => {
    test('returns the user if exists', async () => {
      const user = await factory.create('user', {
        sub: '123',
      });
      const findedUser = await repository.findOrCreate(123);
      expect(findedUser._id).toEqual(user._id);
    });

    test('creates and returns the user if not exist', async () => {
      const spyAdd = jest.spyOn(repository, 'add');
      const user = await repository.findOrCreate(123);
      expect(spyAdd).toHaveBeenCalledWith([{ sub: 123 }]);
      expect(user).toBeInstanceOf(UserModel);
    });
  });
});
