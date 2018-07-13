import { ApiClient } from './client';

const client = new ApiClient();

export default {
  /**
   * @param {string} idToken
   * @returns {{token: string, tokenExpiration: number}} auth object
   */
  async sendIdToken(idToken) {
    const response = await client.post('/auth/token', { idToken });
    return response.data;
  },
};
