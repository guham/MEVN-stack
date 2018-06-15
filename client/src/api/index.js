import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

instance.interceptors.response.use(response => response, error => Promise.reject(error.response));

export default instance;
