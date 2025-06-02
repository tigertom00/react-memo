import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const baseURL = 'http://10.20.30.202:8000/';

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (accessToken) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `JWT ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Unable to connect to the server. Please check your connection.',
      });
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === `${baseURL}token/refresh/`
    ) {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      router.replace('/auth');
      return Promise.reject(error);
    }

    if (
      error.response.data?.code === 'token_not_valid' &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((accessToken) => {
            originalRequest.headers['Authorization'] = `JWT ${accessToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        await AsyncStorage.removeItem('access_token');
        router.replace('/auth');
        return Promise.reject(error);
      }

      let tokenParts;
      try {
        tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
      } catch (e) {
        console.error('Invalid refresh token format', e);
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        router.replace('/auth');
        return Promise.reject(error);
      }

      const now = Math.ceil(Date.now() / 1000);
      if (tokenParts.exp > now) {
        try {
          const response = await axiosInstance.post('token/refresh/', {
            refresh: refreshToken,
          });
          await AsyncStorage.setItem('access_token', response.data.access);
          await AsyncStorage.setItem('refresh_token', response.data.refresh);
          axiosInstance.defaults.headers[
            'Authorization'
          ] = `JWT ${response.data.access}`;
          onRefreshed(response.data.access);
          isRefreshing = false;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed', refreshError);
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('refresh_token');
          router.replace('/auth');
          return Promise.reject(refreshError);
        }
      } else {
        console.log('Refresh token expired', tokenParts.exp, now);
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        router.replace('/auth');
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
