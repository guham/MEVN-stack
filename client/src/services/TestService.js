import api from '@/services/Api';

export default {
  fetchValueFromServer() {
    return api.get('api/foo/test');
  },
};
