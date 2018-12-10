const factory = require('../../../factory');
const UsersService = require('../../../../src/components/users/UsersService');

describe('Test Users service', () => {
  let usersService;

  describe('findOne', () => {
    test('calls users repository `findOne` method', () => {
      const usersRepository = {
        findOne: jest.fn(),
      };
      usersService = new UsersService({ usersRepository });
      usersService.findOne();
      expect(usersRepository.findOne).toHaveBeenCalledWith({});
    });
  });

  describe('findOrCreate', () => {
    test('calls users repository `findOrCreate` method', () => {
      const usersRepository = {
        findOrCreate: jest.fn(),
      };
      usersService = new UsersService({ usersRepository });
      usersService.findOrCreate(1);
      expect(usersRepository.findOrCreate).toHaveBeenCalledWith(1);
    });
  });

  describe('storeUserRefreshToken', () => {
    test('adds new refresh token to user', async () => {
      const usersRepository = {
        save: jest.fn(),
      };
      const user = await factory.build('user');
      expect(user.refreshTokens.size).toBe(0);
      usersService = new UsersService({ usersRepository });
      usersService.storeUserRefreshToken(user, 'refresh token');
      expect(usersRepository.save).toHaveBeenCalledWith(user);
      expect(user.refreshTokens.size).toBe(1);
    });
  });

  describe('removeUserRefreshToken', () => {
    test('returns true if the refresh token belongs to the user and has been successfully deleted', async () => {
      const usersRepository = {
        save: jest.fn(),
      };
      const user = await factory.build('user', {
        refreshTokens: new Map([['key', 'refresh token']]),
      });
      expect(user.refreshTokens.size).toBe(1);
      usersService = new UsersService({ usersRepository });
      const result = await usersService.removeUserRefreshToken(user, 'refresh token');
      expect(usersRepository.save).toHaveBeenCalledWith(user);
      expect(user.refreshTokens.size).toBe(0);
      expect(result).toBeTruthy();
    });

    test('returns false if the refresh token does not belong to the user', async () => {
      const usersRepository = {
        save: jest.fn(),
      };
      const user = await factory.build('user', {
        refreshTokens: new Map([['key', 'refresh token']]),
      });
      usersService = new UsersService({ usersRepository });
      const result = await usersService.removeUserRefreshToken(user, 'not my token');
      expect(usersRepository.save).not.toHaveBeenCalled();
      expect(user.refreshTokens.size).toBe(1);
      expect(result).toBeFalsy();
    });
  });
});
