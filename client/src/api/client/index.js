import axios from 'axios';
import { onFulfilled, onRejected } from './handlers';

const options = {
  baseURL: process.env.VUE_APP_API_URL,
};

const client = axios.create(options);
client.interceptors.response.use(onFulfilled, onRejected);

export default client;

class ApiClient {
  constructor(httpClient) {
    this.client = httpClient;
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

export const createClient = () => new ApiClient(client);
