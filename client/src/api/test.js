import { ApiClient } from './client';

const client = new ApiClient();

export default {
  /**
   * @returns {Promise<Object>}
   */
  fetchValueFromServer() {
    return client.get('/api/foo/test');
  },
};
