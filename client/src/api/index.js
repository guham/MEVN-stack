import axios from 'axios';
import { onFulfilled, onRejected } from './handlers';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

axios.interceptors.response.use(onFulfilled, onRejected);

export default axios;
