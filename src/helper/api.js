import axios from 'axios';
import { Cookies } from 'react-cookie';

const URI = require('uri-js');
export const baseURL = 'https://next-whitelabelling-stage-api.azurewebsites.net/api';   
// export const baseURL = 'https://nextwhitelabelling-prod.azurewebsites.net/api';

// export const baseURL = process.env.APP_API_URL;

const ApiV1 = axios.create({
    baseURL
});
ApiV1.interceptors.request.use(async (config) => {
    const cookies = new Cookies();
    const token = cookies.get('userAuthtoken');

    config.withCredentials = false;
    config.headers = token
        ? {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
          }
        : {
              Accept: 'application/json',
              'Content-Type': 'application/json'
          };
    // config.timeout = 25000;
    return config;
});

export { ApiV1 };
