
const defaultController = require('../../../../src/components/default/DefaultController');

describe('Test Default controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  describe('index', () => {
    test('calls res.json() with an empty object', async () => {
      const controller = defaultController();
      await controller.index(req, res, next);
      expect(res.json).toHaveBeenCalledWith({});
    });
  });

  describe('favicon', () => {
    test('calls res.sendStatus() with the HTTP status code 204', async () => {
      const controller = defaultController();
      await controller.favicon(req, res, next);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });
});
