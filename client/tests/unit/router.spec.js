import Vue from 'vue';
import Router from 'vue-router';
import router from '@/router';
// routes
import Home from '@/views/Home.vue';
import Test from '@/views/Test.vue';

jest.mock('vue', () => ({
  use: jest.fn(),
}));

jest.mock('vue-router', () => class VueRouter {
  constructor(routes) {
    return routes;
  }
});

describe('Router', () => {
  test('Vue should use router', () => {
    expect(Vue.use).toHaveBeenCalledWith(Router);
  });

  test('should declare Home route', () => {
    expect(router.routes[0].path).toEqual('/');
    expect(router.routes[0].name).toEqual('Home');
    expect(router.routes[0].component).toEqual(Home);
  });

  test('should declare Test route', () => {
    expect(router.routes[1].path).toEqual('/test');
    expect(router.routes[1].name).toEqual('Test');
    expect(router.routes[1].component).toEqual(Test);
  });
});
