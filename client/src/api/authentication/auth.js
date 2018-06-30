import api from '@/api';

export default async function sendIdToken(idToken) {
  const response = await api.post('/auth/token', { idToken });
  return response.data;
}
