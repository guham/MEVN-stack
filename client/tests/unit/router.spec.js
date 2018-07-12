import router from '@/router';
import store from '@/store';
import Home from '@/views/Home.vue';
import Test from '@/views/Test.vue';
import FooPanel from '@/views/FooPanel.vue';
import NotFound from '@/views/NotFound.vue';

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

  test('should declare Test route', () => {
    expect(routes[1].path).toEqual('/test');
    expect(routes[1].name).toEqual('Test');
    expect(routes[1].component).toEqual(Test);
    expect(routes[1].meta.requiresAuth).toBeTruthy();
  });

  test('should declare FooPanel route', () => {
    expect(routes[2].path).toEqual('/foo');
    expect(routes[2].name).toEqual('FooPanel');
    expect(routes[2].component).toEqual(FooPanel);
    expect(routes[2].meta.requiresAuth).toBeTruthy();
  });

  test('should declare NotFound route', () => {
    expect(routes[3].path).toEqual('/404');
    expect(routes[3].name).toEqual('NotFound');
    expect(routes[3].component).toEqual(NotFound);
  });

  test('should declare redirect to 404 route', () => {
    expect(routes[4].path).toEqual('*');
    expect(routes[4].redirect).toEqual('/404');
  });

  test('should be able to navigate to unprotected page without authentication', () => {
    router.push('/');
    expect(router.history.current.path).toBe('/');
    expect(router.getMatchedComponents('/')[0].name).toBe('Home');
    router.push('/404');
    expect(router.history.current.path).toBe('/404');
    expect(router.getMatchedComponents('/404')[0].name).toBe('NotFound');
  });

  test('should not be able to navigate to protected page when not authenticated', () => {
    router.push('/test');
    expect(router.history.current.path).toBe('/');
  });

  test('should be able to navigate to protected page when authenticated', () => {
    Object.defineProperty(store.getters, 'user/isAuthenticated', {
      get: jest.fn(() => true),
    });
    router.push('/foo');
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
