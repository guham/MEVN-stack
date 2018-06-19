import { onFulfilled, onRejected } from '@/api/handlers';

describe('API handlers', () => {
  test('`onFulfilled` should returns its parameter', () => {
    const response = {
      data: {},
    };
    expect(onFulfilled(response)).toEqual(response);
  });

  test('`onRejected` should returns a new promise with error.response object if exist', () => {
    const error = {
      response: {},
    };
    onRejected(error).catch(e => expect(e).toEqual(error.response));
  });

  test('`onRejected` should returns a new promise with error object if error.response doesn\'t exist', () => {
    const error = {
      message: 'error message',
      data: {},
    };
    onRejected(error).catch(e => expect(e).toEqual(error));
  });
});
