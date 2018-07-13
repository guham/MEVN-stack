import axios from 'axios';
import { onFulfilled, onRejected } from './handlers';

const createClient = () => {
  const options = {
    baseURL: process.env.VUE_APP_API_URL,
  };

  const client = axios.create(options);

  client.interceptors.response.use(onFulfilled, onRejected);

  return client;
};

class ApiClient {
  constructor() {
    this.client = createClient();
  }

  get(url, config = {}) {
    return this.client.get(url, config);
  }

  /* delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  head(url, config = {}) {
    return this.client.head(url, config);
  } */

  post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  /* put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }

  options(url, config = {}) {
    return this.client.options(url, config);
  } */
}

export { ApiClient };

export default createClient;
