const router = require('../../../../src/components/authentication/AuthenticationRoutes');
const asyncHandler = require('../../../../src/middlewares/asyncHandler');

const getRouteByPath = path => router.stack.find(layer => layer.route.path === path);

jest.mock('../../../../src/middlewares/asyncHandler', () => jest.fn().mockImplementation(() => jest.fn()));

describe('Test Authentication routes', () => {
  test('Test `/tokens` route', () => {
    const layer = getRouteByPath('/tokens');
    expect(layer.route.stack[0].method).toBe('post');
    expect(asyncHandler).toHaveBeenCalled();
  });

  test('Test `/refreshTokens` route', () => {
    const layer = getRouteByPath('/refreshTokens');
    expect(layer.route.stack[0].method).toBe('post');
    expect(asyncHandler).toHaveBeenCalled();
  });

  test('Test `/signOut` route', () => {
    const layer = getRouteByPath('/signOut');
    expect(layer.route.stack[0].method).toBe('post');
    expect(asyncHandler).toHaveBeenCalled();
  });
});
