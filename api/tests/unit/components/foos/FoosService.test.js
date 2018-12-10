const factory = require('../../../factory');
const FoosService = require('../../../../src/components/foos/FoosService');

describe('Test Foos service', () => {
  let foosService;

  describe('getAll', () => {
    test('calls foos repository `find` method', () => {
      const foosRepository = {
        find: jest.fn(),
      };
      foosService = new FoosService({ foosRepository });
      foosService.getAll();
      expect(foosRepository.find).toHaveBeenCalledWith({});
    });
  });

  describe('add', () => {
    test('calls foos repository `add` method', async () => {
      const foosRepository = {
        add: jest.fn(),
      };
      const foos = await factory.buildMany('foo', 2, [
        { name: 'foo 1' },
        { name: 'foo 2' },
      ]);
      foosService = new FoosService({ foosRepository });
      foosService.add(foos);
      expect(foosRepository.add).toHaveBeenCalledWith(foos);
    });
  });

  describe('getById', () => {
    test('calls foos repository `getById` method', () => {
      const foosRepository = {
        getById: jest.fn(),
      };
      foosService = new FoosService({ foosRepository });
      foosService.getById(1);
      expect(foosRepository.getById).toHaveBeenCalledWith(1);
    });
  });
});
