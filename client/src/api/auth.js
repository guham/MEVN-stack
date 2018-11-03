import { createClient } from './client';

const client = createClient();

export default {
  /**
   * @param {string} idToken
   * @returns {{accessToken: string, refreshToken: string, expirationDate: number}} auth object
   */
  async sendIdToken(idToken) {
    const response = await client.post('/auth/tokens', { idToken });
    return response.data;
  },
};
