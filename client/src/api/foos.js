import api from '@/api';

/**
 * @returns {Promise<Object[]>} array of foos
 */
export async function fetchFoos() {
  const response = await api.get('/api/foo');
  return response.data;
}

/**
 * @param {string} name
 * @returns {Promise<Object>} added foo
 */
export async function addFoo(name) {
  const response = await api.post('/api/foo/add', { name });
  return response.data;
}
