import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

axios.interceptors.response.use(response => response, error => Promise.reject(error.response));

export default axios;
