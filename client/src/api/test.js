import { createClient } from './client';

const client = createClient();

export default {
  /**
   * @returns {Promise<Object>}
   */
  fetchValueFromServer() {
    return client.get('/api/foos/test');
  },
};
