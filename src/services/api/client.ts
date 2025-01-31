import axios from 'axios';
import { API_TOKEN, API_BASE_URL } from './constants';
import { logger } from '../../utils/logger';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Accept': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    logger.debug('API Request', {
      url: fullUrl,
      method: config.method?.toUpperCase(),
      headers: {
        ...config.headers,
        Authorization: '***** REDACTED *****' // Hide sensitive data
      },
      params: config.params
    });
    return config;
  },
  (error) => {
    logger.error('Request Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    logger.debug('API Response', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    logger.error('Response Error', {
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);