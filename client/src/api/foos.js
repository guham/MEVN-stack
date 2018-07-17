import { createClient } from './client';

const client = createClient();

export default {
  /**
   * @returns {Array<Object>} array of foos
   */
  async fetchFoos() {
    const response = await client.get('/api/foo');
    return response.data;
  },
  /**
   * @param {string} name
   * @returns {Object} added foo
   */
  async addFoo(name) {
    const response = await client.post('/api/foo/add', { name });
    return response.data;
  },
};
