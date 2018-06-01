import api from '@/api';

/**
 * @returns {Promise<Object>}
 */
export default function fetchValueFromServer() {
  return api.get('/api/foo/test');
}
