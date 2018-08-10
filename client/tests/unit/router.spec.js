import router from '@/router';
import store from '@/store';
import Home from '@/views/Home.vue';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

jest.mock('@/store', () => ({
  default: jest.fn(),
  getters: {
    get 'user/isAuthenticated'() {
      return false;
    },
  },
}));

describe('Router', () => {
  const { routes } = router.options;

  test('is in `history` mode', () => {
    expect(router.mode).toBe('history');
  });

  test('should declare Home route', () => {
    expect(routes[0].path).toEqual('/');
    expect(routes[0].name).toEqual('Home');
    expect(routes[0].component).toEqual(Home);
  });

  test('should declare Test route', async () => {
    expect(routes[1].path).toEqual('/test');
    expect(routes[1].name).toEqual('Test');
    const component = await routes[1].component();
    expect(component.default.name).toBe('Test');
    expect(routes[1].meta.requiresAuth).toBeTruthy();
  });

  test('should declare FooPanel route', async () => {
    expect(routes[2].path).toEqual('/foo');
    expect(routes[2].name).toEqual('FooPanel');
    const component = await routes[2].component();
    expect(component.default.name).toBe('FooPanel');
    expect(routes[2].meta.requiresAuth).toBeTruthy();
  });

  test('should declare NotFound route', async () => {
    expect(routes[3].path).toEqual('/404');
    expect(routes[3].name).toEqual('NotFound');
    const component = await routes[3].component();
    expect(component.default.name).toBe('NotFound');
  });

  test('should declare redirect to 404 route', () => {
    expect(routes[4].path).toEqual('*');
    expect(routes[4].redirect).toEqual('/404');
  });

  test('should be able to navigate to unprotected page without authentication', async () => {
    router.push('/');
    expect(router.history.current.path).toBe('/');
    expect(router.getMatchedComponents('/')[0].name).toBe('Home');
    router.push('/404'); // route is pending
    await router.getMatchedComponents('/404')[0]();
    expect(router.history.current.path).toBe('/404');
    expect(router.getMatchedComponents('/404')[0].name).toBe('NotFound');
  });

  test('should not be able to navigate to protected page when not authenticated', () => {
    router.push('/test');
    expect(router.history.current.path).toBe('/');
  });

  test('should be able to navigate to protected page when authenticated', async () => {
    Object.defineProperty(store.getters, 'user/isAuthenticated', {
      get: jest.fn(() => true),
    });
    router.push('/foo');
    await router.getMatchedComponents('/foo')[0]();
    expect(router.history.current.path).toBe('/foo');
  });

  test('should be able to navigate to unprotected page when authenticated', () => {
    Object.defineProperty(store.getters, 'user/isAuthenticated', {
      get: jest.fn(() => true),
    });
    router.push('/');
    expect(router.history.current.path).toBe('/');
  });
});
