import axios from 'axios';
import { Cookies } from 'react-cookie';

const URI = require('uri-js');
// export const baseURL = 'https://syyveapp-stage-api.azurewebsites.net/api';   
export const baseURL = 'https://nextwhitelabelling-prod.azurewebsites.net/api';

// export const baseURL = process.env.APP_API_URL;

const ApiV1 = axios.create({
  baseURL
});

ApiV1.interceptors.request.use(
  (config) => {
    const cookies = new Cookies();
    const token = cookies.get('userAuthtoken');

    // ❗ DO NOT force Content-Type here
    config.headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
      Accept: 'application/json'
    };

    return config;
  },
  (error) => Promise.reject(error)
);

export { ApiV1 };
